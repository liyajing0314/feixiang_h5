<template>
  <div class="pannel">
    <p class="pannel-head">任务完成情况</p>
    <div ref="rwwcqk" class="charts"></div>
  </div>
</template>

<script>
  import {getX_tasklist} from '@/api/kanban'
  export default {
    props:['dateList'],
    data() {
      return {
        chartData:{}
      }
    },
    watch:{
      project: {
        handler(newName, oldName) {
          this.$nextTick(()=>{
            this.getData()
          })
        },
        immediate: true
      }
    },
    mounted() {
      let that = this

      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.chart.resize()
        }, 100)
      });
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        }
      }
    },
    methods: {
      getData(){
        this.chart = this.$echarts.init(this.$refs.rwwcqk)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#ffffff',
          textColor: '#2574f0'
        });

        let param = {
          pid:this.project.id
        }
        getX_tasklist(param).then(res=>{
          if(res.code == 200){
            this.chartData = res.data
            this.getChart()
          }else{
            this.chartData = {}
            this.chart.hideLoading();
          }
        })
      },
      getChart() {
        let that = this

        this.options = {
          color:['rgba(0,116,248,1)','rgba(248,175,0,1)'],
          grid: {
            containLabel: true,
            bottom: 20,
            top: 60,
            left: 10,
            right: 10
          },
          legend:{
            data: ['总任务数', '已完成任务数'],
            left:'left'
          },
          xAxis: {
            type: 'category',
            // interval: 0,
            boundaryGap :true,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              // interval: 0
            },
            axisLabel: {
              show: true,
              color: 'rgba(191,197,206,1)',
              width: 30,
              overflow: 'breakAll'
            },
            data: this.dateList
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: [{
              data: this.chartData.list2,
              type: 'line',
              smooth: true,
              showSymbol:false,
              name:'总任务数'
            },
            {
              data: this.chartData.list1,
              type: 'line',
              smooth: true,
              showSymbol:false,
              name:'已完成任务数'
            },
            ]
          }

          this.chart.setOption(this.options, true)
          this.chart.hideLoading();
        }
      }
    }
</script>

<style scoped lang="scss">
  .charts {
    height: 260px;
    width: 100%;
  }
</style>

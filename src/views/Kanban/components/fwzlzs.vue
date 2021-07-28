<template>
  <div class="pannel">
    <p class="pannel-head">服务质量走势</p>
    <div ref="fwzlzs" class="charts"></div>
  </div>
</template>

<script>
  import {serviceQualityTrend} from '@/api/kanban'
  export default {
    props:['dateList'],
    data() {
      return {
        chartData:{}
      }
    },
    mounted() {
      let that = this
      this.getData()
      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.chart.resize()
        }, 100)
      });
      this.getChart()
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
        let param = {
          pid:this.project.id
        }
        serviceQualityTrend(param).then(res=>{
          if(res.code == 200){
            this.chartData = res.data
            this.getChart()
          }else{
            this.chartData = {}
          }
        })
      },
      getChart() {
        let that = this
        this.chart = this.$echarts.init(that.$refs.fwzlzs)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        this.options = {
          color:['rgba(255,112,128,1)'],
          grid: {
            containLabel: true,
            bottom: 20,
            top: 20,
            left: 10,
            right: 10
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
              data: this.chartData.percentageComplete,
              type: 'line',
              smooth: true,
              showSymbol:false,
            }
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

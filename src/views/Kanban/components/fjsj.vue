<template>
  <div class="pannel">
    <p class="pannel-head">
      <span>房间数据</span>
      <span @click="switchTime">
        <span class="sel-data">.{{chineseNum(month)}}月</span>
        <img src="@/assets/images/icon_change.png" class="icon-change" />
      </span>
      <span class="btn-sel" @click="switchRoom">
        <span>选择房间</span>
        <span class="num">{{chartData.length}}</span>
      </span>
    </p>
    <div ref="fjsj" class="charts"></div>
    <sel-picker ref="SelPicker"  @selPicker="selPicker"></sel-picker>
    <select-room ref="SelRoom" :list="dataList" @selRoomData="selRoomData"></select-room>
  </div>
</template>

<script>
  import {selectRoomhourListNew} from '@/api/kanban'
  import {toChineseNum,parseTime} from '@/utils/index.js'
  import SelectRoom from '@/components/selectRoom'
  import SelPicker from '@/components/SelPicker'
  export default {
    components:{SelPicker,SelectRoom},
    data() {
      return {
        month:'',
        dataList:[],
        chartData:[]
      }
    },
    mounted() {
      let that = this
      let time = new Date().getTime()
      this.month = parseTime(time,'{y}-{m}')

      // this.getData()

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
      },
    },
    watch:{
      project: {
        handler(newName, oldName) {
          let time = new Date().getTime()
          this.month = parseTime(time,'{y}-{m}')
          this.getData()
        },
        immediate: true
      }
    },
    methods: {
      getData(){
        let param = {
          pid:this.project.id,
          month:this.month
        }
        selectRoomhourListNew(param).then(res=>{
          if(res.code === 200){
            let data = res.data
            this.dataList = data

            this.chartData = data.slice(0,15)
            this.getChart(this.chartData)
          }else{
            this.dataList = []
            this.chartData = []
            this.getChart(this.chartData)
          }
        })
      },
      selRoomData(val){
        this.chartData = val
        this.getChart(this.chartData)
      },
      switchRoom(){
        this.$refs.SelRoom.showPopup()
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      },
      selPicker(val){
        this.month = val
        this.getData()
      },
      getChart(data) {
        let value=[],xAxis=[]
        if(data.length > 0){
          data.map(item=>{
            value.push(item.roomHours)
            xAxis.push(item.roomName)
          })
        }

        let that = this
        this.chart = this.$echarts.init(that.$refs.fjsj)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        this.options = {
          color: ['rgba(255,99,55,1)'],
          grid: {
            containLabel: true,
            bottom: 20,
            top: 20,
            left: 10,
            right: 10
          },
          // calculable: true,
          xAxis: {
            type: 'category',
            interval: 0,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              interval: 0
            },
            axisLabel: {
              show: true,
              color: 'rgba(191,197,206,1)',
              width: 30,
              overflow: 'breakAll'
            },
            data: xAxis
          },
          yAxis: {
            type: 'value',
            boundaryGap: false,
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          dataZoom: [{
              show: false,
              start: 0,
              end: 50
            },
            {
              type: 'inside',
              start: 0,
              end: 30
            },
          ],
          series: [{
            type: 'bar',
            itemStyle: {
              borderRadius: 2,
            },
            barWidth: 16,
            label:{
              show:true,
              color:'rgba(153,153,153,1)',
              position:'top'
            },
            data: value,
          }]
        }

        this.chart.setOption(this.options, true)
        this.chart.hideLoading();
      },
      chineseNum(val){
        if(!val){
          return ''
        }

        let month = val.split('-')[1]
        let data = month >= 10 ? month :(month.length > 1 ? month.split('')[1] : month)
        return toChineseNum(data)
      },
    }
  }
</script>

<style scoped lang="scss">
  .charts {
    height: 260px;
    width: 100%;
  }

  .sel-data {
    font-size: 16px;
    font-weight: 600;
    color: #2574f0;
  }

  .icon-change {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    vertical-align: middle;
  }

  .btn-sel {
    float: right;
    padding: 4px 30px 4px 8px;
    background: rgba(37, 116, 240, 0.1);
    border-radius: 6px;
    color: #2574f0;
    font-size: 12px;
    font-weight: 400;
    position: relative;

    .num {
      color: #333333;
      display: inline-block;
      margin-left: 4px;
    }

    &:before {
      content: '';
      position: absolute;
      right: 12px;
      top: 6px;
      border: solid #2574f0;
      ;
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    }
  }
</style>

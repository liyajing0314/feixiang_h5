<template>
  <div class="pannel">
    <p class="pannel-head">
      <span>房间数据</span>
      <span @click="switchTime">
        <span class="sel-data">.七月</span>
        <img src="@/assets/images/icon_change.png" class="icon-change" />
      </span>
      <span class="btn-sel" @click="switchRoom">
        <span>选择房间</span>
        <span class="num">15</span>
      </span>
    </p>
    <div ref="fjsj" class="charts"></div>
    <sel-picker ref="SelPicker"></sel-picker>
    <select-room ref="SelRoom"></select-room>
  </div>
</template>

<script>
  import SelectRoom from '@/components/selectRoom'
  import SelPicker from '@/components/SelPicker'
  export default {
    components:{SelPicker,SelectRoom},
    data() {
      return {

      }
    },
    mounted() {
      let that = this
      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.chart.resize()
        }, 100)
      });
      this.getChart()
    },
    methods: {
      switchRoom(){
        this.$refs.SelRoom.showPopup()
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      },
      getChart() {
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
            data: ['5#2F- 杂物间 超出', '5#2F- 杂物间', '5#2F 走廊', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          }]
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

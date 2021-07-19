<template>
  <div class="pannel">
    <p class="pannel-head">任务完成情况</p>
    <div ref="rwwcqk" class="charts"></div>
  </div>
</template>

<script>
  export default {
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
      getChart() {
        let that = this
        this.chart = this.$echarts.init(that.$refs.rwwcqk)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

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
            data: ['01', '02', '03', '04', '05', '06', '07']
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
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true,
              name:'总任务数'
            },
            {
              data: [800, 902, 901, 904, 290, 130, 320],
              type: 'line',
              smooth: true,
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

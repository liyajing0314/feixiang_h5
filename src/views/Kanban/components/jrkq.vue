<template>
  <div>
    <p>今日概况</p>
    <div ref="jrgk" class="charts"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chart: null,
        options: {},
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
        this.chart = this.$echarts.init(that.$refs.jrgk)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        this.options = {
          series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 240,
            splitNumber: 12,
            itemStyle: {
              color: '#58D9F9',
              shadowColor: 'rgba(0,138,255,0.45)',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            progress: {
              show: true,
              roundCap: true,
              width: 18
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              splitNumber: 0,
              lineStyle: {
                width: 0,
                color: '#999'
              }
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [{
              value: 100
            }]
          }]
        };

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

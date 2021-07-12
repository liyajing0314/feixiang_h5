<template>
  <div>
    <p>服务质量走势</p>
    <div ref="fwzlzs" class="charts"></div>
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
        this.chart = this.$echarts.init(that.$refs.fwzlzs)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        this.options = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true
            },
            {
              data: [800, 902, 901, 904, 290, 130, 320],
              type: 'line',
              smooth: true
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

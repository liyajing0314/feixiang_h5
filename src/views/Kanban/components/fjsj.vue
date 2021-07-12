<template>
  <div>
    <p>房间数据</p>
    <div ref="fjsj" class="charts"></div>
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
        this.chart = this.$echarts.init(that.$refs.fjsj)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        this.options = {
          legend: {
            data: ['蒸发量', '降水量']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
              name: '蒸发量',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            },
            {
              name: '降水量',
              type: 'bar',
              data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
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

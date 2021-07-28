<template>
  <div class="pannel">
    <p class="pannel-head">历史考勤<span @click="selPeople">选择人员</span></p>
    <div>
      <div ref="lskq" class="charts"></div>
    </div>

  </div>
</template>

<script>
  export default {
    components: {
    },
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
      selPeople() {
        console.info(this.$refs)
        this.$refs.selectPeople.showPopup()
      },
      getChart() {
        let that = this
        this.chart = this.$echarts.init(that.$refs.lskq)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        this.options = {
          color:['#63DAAB','#EFBC2D','#E37447','#74271F','#7E5EC6','#5699C7','#4459FC'],
          legend: {
            data: ['出勤天数', '迟到次数','早退次数','矿工次数','请假次数','加班天数','应出勤天数']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'category',
            data: ['巴西', '印尼', '美国', '印度', '中国', '世界人'],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true
            },
            minorSplitLine: {
              show: true
            }
          },
          series: [{
              name: '出勤天数',
              type: 'bar',
              itemStyle: {
                borderRadius: [0, 2, 2, 0],
              },

              data: [18203, 23489, 29034, 104970, 131744, 630230]
            },
            {
              name: '迟到次数',
              type: 'bar',
              data: [19325, 23438, 31000, 121594, 134141, 681807]
            }
          ]
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

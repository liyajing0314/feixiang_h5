<template>
  <div class="pannel">
    <p class="pannel-head">
      <span>今日考勤</span>
      <span class="report-btn" @click="toReport">
        <img src="@/assets/images/kanban/icon_report@2x.png" class="icon-report"/>
        查看报表
      </span>
    </p>
    <div class="pannel-body">
      <div ref="jrgk" class="charts"></div>
      <div class="right-item">
        <div class="items">
          <span><img src="@/assets/images/kanban/icon_yd.png" class="icon" />应到人数</span>
          <span class="nums">{{data.shouldComeNum}}</span>
        </div>
        <div class="items items-yd">
          <span><img src="@/assets/images/kanban/icon_sd.png" class="icon" />实到人数</span>
          <span class="nums">{{data.haveArrivedNum}}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props:['data'],
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

    },
    watch:{
      data: {
        handler(newName, oldName) {
          this.$nextTick(()=>{
            this.getChart()
          })
        },
        immediate: true
      }
    },
    methods: {
      getChart() {
        let max = 240
        let that = this
        this.chart = this.$echarts.init(that.$refs.jrgk)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#030D17',
          textColor: 'white'
        });

        let haveArrivedNum = this.data.haveArrivedNum //实到人数
        let shouldComeNum = this.data.shouldComeNum //应到人数
        let per = (parseInt(haveArrivedNum / shouldComeNum) || 0) * 100

        this.options = {
          title: [{
            text: per+'%',
            textStyle: {
              color: '#333333',
              fontSize: 24
            },
            itemGap: 20,
            left: 'center',
            top: '30%'
          }, {
            text: '到岗率',
            textStyle: {
              color: '#808896',
              fontSize: 12,
              fontWeight: 'normal'
            },
            itemGap: 20,
            left: 'center',
            top: '56%'
          }],
          angleAxis: {
            polarIndex: 0,
            min: 0,
            max: 100,
            show: false,
            boundaryGap: ['40%', '40%'],
            startAngle: 90,
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,

            },
            axisTick: {
              show: false
            },
          },
          polar: [{
            center: ['50%', '50%'], //中心点位置
            radius: '175%' //图形大小
          }],
          xAxis: {
            show: false,
            type: 'value'
          },
          series: [{
              type: 'bar',
              z: 10,
              name: "完成度",
              data: [per],
              showBackground: false,
              backgroundStyle: {
                borderWidth: 10,
                width: 10
              },
              coordinateSystem: 'polar',
              roundCap: false,
              barWidth: 12, //大的占比环
              itemStyle: {
                normal: {
                  opacity: 1,
                  color: "#2574F0"
                }
              },
            },
            {
              type: 'pie',
              name: '内层细圆环',
              radius: ['80%', '95%'],
              center: ['50%', '50%'], //中心点位置
              startAngle: 90,
              hoverAnimation: false,
              clockWise: true,
              silent: true,
              itemStyle: {
                normal: {
                  color: '#f3f3f7',
                  shadowBlur: 0,
                  shadowColor: '#66666a',
                }
              },
              tooltip: {
                show: false,
              },
              label: {
                show: false
              },
              data: [100]
            }
          ]
        };

        this.chart.setOption(this.options, true)
        this.chart.hideLoading();
      },
      toReport(){
        this.$router.push('/viewReport')
      }
    }
  }
</script>

<style scoped lang="scss">
  .pannel-body {
    display: flex;
  }
  .pannel-head {
    @include flexbox();
    .report-btn {
      display: inline-block;
      height: 24px;
      line-height: 22px;
      background: rgba(37,116,240,0.1);
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 12px;
      color: #2574f0;
      cursor: pointer;
    }
    .icon-report {
      width:16px;
      height:16px;
      margin-right: 4px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  .charts {
    height: 120px;
    width: calc(200% - 180px);
  }

  .right-item {
    width: 180px;
    min-width: 180px;
  }

  .items {
    width: 100%;
    height: 48px;
    border-radius: 6px;
    padding: 12px;
    background: #eaedf1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 12px;
    color: #808896;
  }

  .items-yd {
    background: rgba(37, 116, 240, 0.10);
  }

  .nums {
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-right: 3px;
    vertical-align: middle;
    margin-top: -2px;
  }
</style>

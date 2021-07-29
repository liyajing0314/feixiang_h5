<template>
  <div class="pannel">
    <p class="pannel-head">服务质量走势</p>
    <div ref="fwzlzs" class="charts"></div>
    <div class="no-data" v-show="nodataFlag">暂无数据</div>
  </div>
</template>

<script>
  import {
    serviceQualityTrend
  } from '@/api/kanban'
  export default {
    props: ['dateList'],
    data() {
      return {
        chartData: {},
        nodataFlag: false
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
      project: {
        get() {
          return this.$store.getters.getSelProject
        }
      }
    },
    watch: {
      project: {
        handler(newName, oldName) {
          this.$nextTick(() => {
            this.getData()
          })
        },
        immediate: true
      }
    },
    methods: {
      getData() {
        this.nodataFlag = false
        this.chart = this.$echarts.init(this.$refs.fwzlzs)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#ffffff',
          textColor: '#2574f0'
        });

        let param = {
          pid: this.project.id
        }
        serviceQualityTrend(param).then(res => {
          if (res.code == 200) {
            let data = res.data
            let percentageComplete = []
            let dateList = []
            data.map(item => {
              percentageComplete.push(item.percentageComplete)
              // let data = item.recordDate.split('-')
              // percentageComplete.push({
              //   value:[
              //     [
              //       data[0],data[1],data[2]
              //     ].join('/'),item.percentageComplete
              //   ]
              // })
              dateList.push(item.recordDate)
            })

            this.getChart(percentageComplete, dateList)
          } else {
            this.chart.hideLoading();
            this.nodataFlag = true
          }
        })
      },
      getChart(percentageComplete, dateList) {
        let that = this

        this.options = {
          color: ['rgba(255,112,128,1)'],
          grid: {
            containLabel: true,
            bottom: 20,
            top: 20,
            left: 10,
            right: 10
          },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                shadowStyle:{
                  color:'rgba(255,112,128,0.05)'
                }
              },
              formatter:'{c}',
              backgroundColor:'#333333',
              padding:[0 ,4 ,0,4],
              position: function (point, params, dom, rect, size) {
                return [point[0], '20%'];
              },
              textStyle:{
                color:'#ffffff'
              }
          },
          xAxis: {
            type: 'category',
            // interval: 0,
            boundaryGap: true,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
            },
            axisLabel: {
              show: true,
              color: 'rgba(191,197,206,1)',
              // formatter:function(value,index){
              //   console.info('value',value,index)
              //   let v = value.split('-')
              //   return v[2]
              // },
              // formatter: {
              //     month: '{MMM}',
              //     day: '{d}'
              // },
              interval: 0,
              formatter: function (value,index) {
                  const date = new Date(value);
                  const monthStart = new Date(value);

                  monthStart.setDate(0);
                  monthStart.setHours(1);
                  monthStart.setMinutes(0);
                  monthStart.setSeconds(0);
                  monthStart.setMilliseconds(0);
                  if(index === 0){
                    return '{day|' + date.getDate() + '}\n'
                        + '{month|' + (date.getMonth() + 1)  + '月}';
                  }else{
                    if (date.getTime() === monthStart.getTime()) {
                        return '{month|' + (date.getMonth() + 1)  + '月}\n'
                            + '{day|' + date.getDate() + '}';
                    }else {
                        return '{day|' + date.getDate() + '}'
                    }
                  }
              },
              rich: {
                  month: {
                    marginTop:6
                  },
                  day: {

                  }
              }
            },
            data: dateList
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              show: true,
              color: 'rgba(191,197,206,1)',
            },
            splitLine: {
              show: false
            }
          },
          series: [{
            data: percentageComplete,
            type: 'line',
            smooth: true,
            showSymbol: false,
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
</style>

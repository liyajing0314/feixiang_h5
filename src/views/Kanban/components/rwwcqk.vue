<template>
  <div class="pannel">
    <p class="pannel-head">任务完成情况</p>
    <div ref="rwwcqk" class="charts"></div>
    <div class="no-data" v-show="nodataFlag">暂无数据</div>
  </div>
</template>

<script>
  import {getX_tasklist} from '@/api/kanban'
  export default {
    data() {
      return {
        nodataFlag:false
      }
    },
    watch:{
      project: {
        handler(newName, oldName) {
          this.$nextTick(()=>{
            this.getData()
          })
        },
        immediate: true
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
      project:{
        get(){
          return this.$store.getters.getSelProject
        }
      }
    },
    methods: {
      getData(){
        this.nodataFlag = false
        this.chart = this.$echarts.init(this.$refs.rwwcqk)
        this.chart.showLoading({
          text: '正在加载数据',
          maskColor: '#ffffff',
          textColor: '#2574f0'
        });

        let param = {
          pid:this.project.id
        }
        getX_tasklist(param).then(res=>{
          if(res.code == 200){
            let data = res.data
            let succeedCountNum = []
            let totalNum = []
            let dateList = []
            data.map(item=>{
              succeedCountNum.push(item.succeedCountNum)
              totalNum.push(item.totalNum)
              dateList.push(item.recordDate)
            })
            this.getChart(succeedCountNum,totalNum,dateList)
          }else{
            this.chart.hideLoading();
            this.nodataFlag = true
          }
        })
      },
      getChart(succeedCountNum,totalNum,dateList) {
        let that = this
        let icon1 = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAACM0lEQVRIS+2Uu2tUURCHvzln72N3Y7J5CCZECCIWEVNoJ6S3VbBMmyKgoKSxMrVubZHOSsHGwj8gYKEIwS6oBAwIJoJ5uo+be889I7uboDEb1iZdpj1zft/M78wc4ZRDTlmfM0BPh0+2aE77iN0U4gqY+AtPZaOnWpeE44AHu0PY6AnIDGj4544sI/4Za/FzXkn+v7CjgIeNi1izhHIJJEP4iGoCTAGVA9HPII+ohq9BtBfoKGA+WQauI/KBXGeoRV/ZXhHGJy02vQ36GLjSEZVPKC8w+p7c1zDmGnAf2KIaTx+C/wW8BYnx+R2sz0htSByDNhyZS3D9jjibwft5hInu1cs7qtHNLgAV7hFiqFBIh0HKqAsOEj22kOB8DRftktOkmE8j7hbCVVRK4L9h7Bt2gpcsSnYcMKsBpcYIJriAlxKhZnhNsCheAjIXYQLBtt4k2CVhrw2yZLAKw5ctOzshYSWnRJMFcW0jOyQV5ihTTMeRfBB8HVP+iVCnsaX4oYA46UPMAJgyPhNUU0yhgdF9HIpJQyQKybWGjX5QlUZH+DBmv5c4N3i+XW0cbbO68otXk51WFxA2CSjvlkiiAQqmH/IijgItE1tZQQBOM5zfZH9rncWxFuCvv+iuWgbXI8ZGYYmUpU6LR2JBDWtrIZWJGGmWwRQJWvalBh84oqhOkz02qB/uSpdNbnXVa75VmF0ukN6wjGDbReytK4xmLJKD+O5j2mtrTjw/uaiz77qnqb8BRfnSFaKF9xwAAAAASUVORK5CYII='
        let icon2 = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAACPElEQVRIS+2UPWtUQRSGnzN3JvvpZk38SiGEIFpLRFQQ0goWSRPExt4fYL1WNoLgTzBWsQgWgp1FIIWoRcRGRMSgMURjEnezd+/MvUd2MWZXoolKCsFpZ+Z9znnfmSPs8ZI91uc/YEeH/9gifcCROHDcKsEmzMsk9e1ovwXQaaLYcsUIVxVGNwUFEoWpluda/yQr3aBdAVSR5D7jqtwATnwTWEWYFyUPnFRwwOtMGCuOs9AF3+LFM8wCAwi3M3hulLIIZ1S53CX8MhOuFxJmGCF0bi8ynATuKpwGnuUnerrbArRmmFM4+5Pk3hjh5pc6UwNVIlrk4xSnfWgmJCbgIsOMQpyf4Py2HegTnH/PJU25CBxV2EB5YS0Po5jZOhSco2Is5RDI2QjTEVKCpjR8xErJscoFEhG0vfU9A32E/bhO4UARQ4ynSaCMLNdxhU1hQyWk5K0h80JiIzwBCYa8ZDirbCSeD6URPskpfC/gDqW4yqE0o2wzWmrx4hERcsFRcEpf8BBFNLKINe9p7ItIPrcwuZSSzTGQGkpGWF1v8e7gJA0B3epgjsLaIkNFx2DIcC5COzU40LYFGXGWsp43rL1aoHlsBU8N7RjxFMtbKi2h2i4sP8iynKPZ28E0EQmlZoGKEYoCEQ7VgE8NzSRjo5qjyWO81Mh+fAhawzJKH4Mot0jkHmkPoJNVDcMQEfux9GOWluBwSsowgTHSzeB+MR/ajnTC3fYVdW8oSNvDHYfNDgd29ZP/BvLvA74CIV7fFX7xWJ0AAAAASUVORK5CYII='
        this.options = {
          color:['rgba(0,116,248,1)','rgba(248,175,0,1)'],
          grid: {
            containLabel: true,
            bottom: 10,
            top: 40,
            left: 10,
            right: 10
          },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                shadowStyle:{
                  color:'rgba(0,116,248,0.05)'
                }
              },
              showContent:false
          },
          legend:{
            data: [{
              name:'总任务数',
              icon :icon1
            }, {
              name:'已完成任务数',
              icon :icon2
            }],
            left:'left'
          },
          xAxis: [{
            type: 'category',
            // interval: 0,
            boundaryGap :false,
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
              // width: 30,
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
              },
              interval: 0,
              // overflow: 'breakAll'
            },
            data: dateList
          },{
            type: 'category',
            boundaryGap :false,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            axisLabel:{
              formatter:function(value,index){
                return '{totalNum|' + totalNum[index] + '}\n'
                    + '{succeedCountNum|' + succeedCountNum[index]  + '}';
              },
              rich: {
                totalNum: {
                  color:'rgba(0,116,248,0.6)',
                  paddingBottom:'4px'
                },
                succeedCountNum: {
                  color:'rgba(248,175,0,0.6)'
                },
              },
              interval: 0,
            },
            data: dateList
          }],
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
              data: totalNum,
              type: 'line',
              smooth: true,
              showSymbol:false,
              name:'总任务数'
            },
            {
              data:succeedCountNum,
              type: 'line',
              smooth: true,
              showSymbol:false,
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

<template>
  <div >
    <van-calendar
      title="5月"
      type ="single"
      :poppable="false"
      :show-confirm="false"
      :show-mark="false"
      :show-subtitle="false"
      :show-title="false"
      :min-date="minDate"
      :max-date="maxDate"
      :row-height="60"
      :color="color"
      :style="{ height: '400px' }"
      :formatter="formatter"
      @select="select"
      v-if = "data.length >0"
    >
      <template #bottom-info="props">
        <div class="bottomInfo">{{props.bottomInfo}}</div>
      </template>
    </van-calendar>
  </div>
</template>

<script>
  export default {
    props:['month','data'],
    data(){
      return {
        color:'#2574f0',
        minDate: new Date(),
        maxDate: new Date(), //new Date(2010, 0, 31)
      }
    },
    mounted() {

    },
    watch:{
      data(n,o){
        this.init()
      }
    },
    methods:{
      init(){
        if(this.data.length >0){
          this.minDate = new Date(this.data[0].data)
          this.maxDate = new Date(this.data[this.data.length - 1].data)
        }
      },
      select(value){
        const year = value.getFullYear()
        const month = value.getMonth() + 1
        const date = value.getDate()

        let day = year + '-' + (month >=10?month:('0'+month)) + '-' + (date >=10 ?date:('0'+date))
        let data = this.data.find(item=>{
          return item.data == day
        })
        this.$emit('selCalendar',data)
      },
      formatter(day) {
        const year = day.date.getFullYear()
        const month = day.date.getMonth() + 1 >=10 ? (day.date.getMonth() + 1) :('0' + (day.date.getMonth() + 1)) ;
        const date = day.date.getDate() >= 10 ? day.date.getDate() : ('0'+day.date.getDate());

        const dateStr = year + '-' + month + '-' + date

        this.data.find(item=>{
          if(item.data == dateStr){
            //状态 (0, “未打卡”), (1, “正常”), (2, “迟到”) , (3, “早退”) , (4, “旷工”) ,
            // (5, “病假”), (6, “事假”), (7, “外出”) , (8, “调休”) , (9, “休息”) , (10, “加班”)

            if(item.status === 0){
              day.bottomInfo = '未打卡'
            }else if(item.status === 1){
              day.bottomInfo = ' '
            }else if(item.status === 2){
              day.bottomInfo = '迟到'
            }else if(item.status === 3){
              day.bottomInfo = '早退'
            }else if(item.status === 4){
              day.bottomInfo = '旷工'
            }else if(item.status === 5){
              day.bottomInfo = '病假'
            }else if(item.status === 6){
              day.bottomInfo = '事假'
            }else if(item.status === 7){
              day.bottomInfo = '外出'
            }else if(item.status === 8){
              day.bottomInfo = '调休'
            }else if(item.status === 9){
              day.bottomInfo = ' '
            }else if(item.status === 10){
              day.bottomInfo = '加班'
            }
            day.className = 'status' + item.status
            return item
          }
        })
        return day;
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/.van-calendar__header {
    box-shadow: none;
  }
  /deep/.van-calendar__weekdays {
    font-size: 14px;
    font-weight: 400;
    color: #808896;
  }
  /deep/.van-calendar__month-title{
    display: none;
  }
  /deep/.van-calendar__days {
    margin-top: 10px;
  }
  /deep/.van-calendar__day {
    margin: 3px;
    width: calc(14.285% - 6px);
    height:60px !important;
    background-color: rgba(101,200,184,0.1);
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    align-items: start;
    padding-top: 8px;
  }
  /deep/.van-calendar__bottom-info {
    bottom:0;
    height:100%;
    width:100%;
    border-radius:6px;
    .bottomInfo {
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      bottom: 10px;
      font-weight: 100;
    }
  }
  /deep/.van-calendar__selected-day {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
    top: 0;
    align-items: start;
    padding-top: 8px;
    background-color: rgb(37, 116, 240) !important;
    .van-calendar__bottom-info  {
      width: 96% !important;
      height: 96% !important;
      left:0;
      right:0;
      margin: 0 auto;
      top:50%;
      transform: translateY(-50%);
      border:2px solid #ffffff !important;
    }
    .bottomInfo {
      color:#FFFFFF !important;
      background-color: rgba(255,255,255, 0) !important;
      border-radius: 6px;
    }
  }

  /deep/.van-calendar__month {
    .status0 {
      background-color: rgba(191,197,206,0.1);
      .bottomInfo {
        color: #bfc5ce;
      }
    }
    .status1 {
      background-color: rgba(101,200,184,0.1);
      .bottomInfo {
        width:16px;
        height:16px !important;
        background: url('~@/assets/images/task/icon_dui@2x.png') no-repeat center center / cover;
      }
      .van-calendar__selected-day {
        .bottomInfo {
          background-image: url('~@/assets/images/task/icon_dui_bai@2x.png');
          bottom: 7px;
        }
      }
    }
    .status2 {
      background-color: rgba(255,160,66,0.10);
      .bottomInfo {
        color: rgba(255,160,66,1);
      }
    }
    .status3 {
      background-color: rgba(162,171,44,0.1);
      .bottomInfo {
        color: #a2ab2c;
      }
    }
    .status4 {
      background-color:rgba(237,79,42,0.10);
      .bottomInfo {
        color: #ed4f2a;
      }
    }
    .status5 {
      background-color:rgba(142,83,208,0.1);
      .bottomInfo {
        color: #8e53d0;
      }
    }
    .status6 {
      background-color: rgba(0,132,255,0.1);
      .bottomInfo {
        color: #0084ff;
      }
    }
    .status7 {
      background-color: rgba(83,126,176,0.1);
      .bottomInfo {
        color: #537eb0;
      }
    }
    .status8 {
      background-color: rgba(153,153,153,0.1);
      .bottomInfo {
        color: #999999;
      }
    }
    .status9 {
      background-color: rgba(153,153,153,0.1);
      .bottomInfo {
        width:16px;
        height:16px !important;
        background: url('~@/assets/images/task/icon_disabled@2x.png') no-repeat center center / cover;
      }
      .van-calendar__selected-day {
        .bottomInfo {
          background-image: url('~@/assets/images/task/icon_disabled_bai@2x.png');
          bottom: 7px;
        }
      }
    }
    .status10 {
      background-color:rgba(186,79,21,0.1);
      .bottomInfo {
        color: #ba4f15;
      }
    }
  }


</style>

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
      :formatter="formatter"
      @select="select"
      v-if = "data.length >0"
    >
      <template #bottom-info="props">
        <div class="bottomInfo" :style="{height:props.bottomInfo}">{{props.bottomInfo}}</div>
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
            //状态 （0 = 无任务 1 = 有任务 2 =有任务但未开始 3=有任务已完成（100%） 4=有任务未完成有异常）
            if(item.status === 0 || item.status === 2){
              day.bottomInfo = '0'
              day.className = 'noTask'
            }else if(item.status === 3){
              day.bottomInfo = item.percent
              day.className = 'finish'
            }else if(item.status === 4){
              day.bottomInfo = item.percent

              let percent = item.percent
              percent = percent.substring(0,percent.indexOf('%'))
              let per = parseFloat(percent)
              if(per >60){
                day.className = 'noFinish noFinish2'
              }else{
                day.className = 'noFinish'
              }
            }
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
    border-radius:4px;
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
      width: calc(100% - 2px) !important;
      height: calc(100% - 2px) !important;
      left:0;
      right:0;
      margin: 0 auto;
      top:50%;
      transform: translateY(-50%);
      border:1px solid #ffffff !important;
    }
    .bottomInfo {
      color:#FFFFFF !important;
      background-color: rgba(255,255,255, 0) !important;
      border-radius: 6px;
    }
  }
  /deep/.noTask {
    background-color: rgba(191,197,206,0.1);
    .bottomInfo {
      color:rgba(191,197,206,0.1);
      width:16px;
      height:16px !important;
      background: url('~@/assets/images/task/icon_disabled@2x.png') no-repeat center center / cover;
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      bottom: 10px;
    }
    .van-calendar__selected-day {
      .bottomInfo {
        color:rgba(191,197,206,0) !important;
        background-image: url('~@/assets/images/task/icon_disabled_bai@2x.png');
        bottom: 7px;
      }
    }
  }
  /deep/.noFinish {
    background: #ffffff;
    .van-calendar__bottom-info {
      border: 1px solid rgba(237,79,42,0.2);
    }
    .bottomInfo {
      width: 100%;
      text-align: center;
      color: #ed4f2a;
      background-color: rgba(237,79,42,0.1);
      bottom:0;
      position: absolute;
      padding: 2px 0 6px;
      box-sizing: border-box;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
  }
  /deep/.noFinish2 {
    .van-calendar__bottom-info {
      border: 1px solid rgba(255,184,39,0.10);
    }
    .bottomInfo {
      color:rgba(255,184,39,1);
      background-color: rgba(255,184,39,0.1);
    }
  }
  /deep/.finish{
    background-color: rgba(101,200,184,0.1);
    .bottomInfo {
      color:rgba(191,197,206,0.1);
      width:16px;
      height:16px !important;
      background: url('~@/assets/images/task/icon_dui@2x.png') no-repeat center center / cover;
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      bottom: 10px;
    }
    .van-calendar__selected-day {
      .bottomInfo {
        color:rgba(191,197,206,0) !important;
        background-image: url('~@/assets/images/task/icon_dui_bai@2x.png');
        bottom: 7px;
      }
    }
  }

</style>

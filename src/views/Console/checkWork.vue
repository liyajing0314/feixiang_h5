<!-- 考勤管理 -->
<template>
  <div>
    <nav-bar @back="$router.back(-1)" title="考勤管理"></nav-bar>
    <div class="container">
      <div class="box">
        <p><span>当前人员:</span><span>某某人员</span><span>切换</span></p>
        <p><span>上班打卡：09:00</span><span>下班打卡:18:00</span></p>
      </div>
      <div class="box">
        <p>考勤日历 <span>切换</span> <span>5月</span></p>
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
          :row-height="50"
          :color="color"
          :style="{ height: '500px' }"
          :formatter="formatter"
          @select="select"
        />
      </div>
      <div class="bottom-box">
        <van-button type="primary">取消</van-button>
        <van-button type="info">修改考勤</van-button>
      </div>
    </div>
  </div>

</template>

<script>
  import NavBar from '@/components/NavBar'
  export default {
    components:{NavBar},
    data(){
      return {
        color:'#1989fa',
        minDate: new Date(2010, 0, 1),
        maxDate: new Date(2010, 0, 31),
      }
    },
    methods:{
      onClickLeft(){

      },
      select(value){
        console.info('value',value)
      },
      formatter(day) {
        const month = day.date.getMonth() + 1;
        const date = day.date.getDate();
        day.bottomInfo = '正常';

        return day;
      }
    }
  }
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  background-color: #eeeeee;
  .box {
    background-color: #ffffff;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 10px;
  }
  .bottom-box {
    position: fixed;
    bottom:0;
    left:0;
    width:100%;
    height:50px;
    background-color: #ffffff;
    text-align: center;
  }
}
</style>

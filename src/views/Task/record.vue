<template>
  <div class="container">
    <div class="title">A座一层卫生间巡视</div>
    <div class="line"></div>
    <div class="content">
      <div class="tab-content">
        <div class="items">
          <span>六月</span>
          <img src="@/assets/images/icon_change.png"
            srcset='../../assets/images/icon_change.png 1x,
                     ../../assets/images/icon_change@2x.png 2x' class="icon-change"/>
        </div>
        <div class="tab-box" ref="tab_box">
          <span class="tab" :class="{'active':tabActive===0}" @click="changeTab(0)">任务总览</span>
          <span class="tab" :class="{'active':tabActive===1}" @click="changeTab(1)">房间视图</span>
          <span class="tab" :class="{'active':tabActive===2}" @click="changeTab(2)">人员视图</span>
          <span class="tab" :class="{'active':tabActive===3}" @click="changeTab(3)">分组视图</span>
        </div>
      </div>
      <div class="calendar-box">
        <calendar-single></calendar-single>
      </div>
    </div>
  </div>
</template>

<script>
  import CalendarSingle from '@/components/CalendarSingle'
  export default {
    components:{CalendarSingle},
    data(){
      return {
        tabActive:0,
        color:'#1989fa',
        minDate: new Date(2010, 0, 1),
        maxDate: new Date(2010, 0, 31),
      }
    },
    mounted() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isUc = u.indexOf('UCBrowser') > -1;    //uc浏览器
      //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid&&isUc){		/*注释5*/
        let tabBox = this.$refs.tab_box
        tabBox.on('touchstart',function(){
          $(document).on('touchmove',function(e){
              e.preventDefault();
          });
          $(document).on('touchend',function(){
              $(document).unbind();
          });
        });
      }
    },
    methods:{
      changeTab(tab){
        this.tabActive = tab
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
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 16px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
}
.line {
  border-top: 1px solid #eaedf1;
}
.content {
  padding: 11px 0;
}
.tab-content {
  display: flex;
  .items {
    width:64px;
    min-width: 64px;
    border-right:1px solid #eaedf1;
    font-size: 16px;
    font-weight: 600;
  }
  .icon-change {
    width:16px;
    height:16px;
    vertical-align: middle;
    margin-top: -2px;
    margin-left: 4px;
  }
  .tab-box {
    flex: 2;
    display: -webkit-box;
    overflow-x: scroll;
    white-space:nowrap;
    -webkit-overflow-scrolling:touch;

    &::-webkit-scrollbar {
      width:0;
      height:0;
      display: none;
    }
  }
  .tab {
    width:81px;
    height:32px;
    line-height: 32px;
    background: #f7f7f8;
    border-radius: 6px;
    color: #808896;
    font-size: 14px;
    font-weight: 400;
    margin-left: 9px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    &.active {
      background: #2574f0;
      color:#ffffff;
    }
  }
}
.calendar-box {
  padding-top: 25px;
}
</style>

<template>
  <div class="container">
    <div class="fixed-box">
      <div class="title">{{planname}}</div>
      <div class="line"></div>
      <div class="tab-content">
        <div class="items" @click="switchTime">
          <span>{{chineseNum(month)}}月</span>
          <svg-icon icon-class="icon_change" class-name="icon-change"></svg-icon>
        </div>
        <div class="tab-box" ref="tab_box">
          <span class="tab" :class="{'active':tabActive===0}" @click="changeTab(0)">任务总览</span>
          <span class="tab" :class="{'active':tabActive===1}" @click="changeTab(1)">房间视图</span>
          <span class="tab" :class="{'active':tabActive===2}" @click="changeTab(2)" v-if="taskData.usertype === 1">人员视图</span>
          <span class="tab" :class="{'active':tabActive===3}" @click="changeTab(3)" v-if="taskData.usertype === 2">分组视图</span>
        </div>
      </div>
    </div>

    <div class="content">
      <div v-show="tabActive === 0">
        <calendar-box :month="month" :data="tabList0" :tabActive="tabActive"></calendar-box>
      </div>
      <div v-show="tabActive === 1">
        <calendar-box :month="month" :data="tabList1" :tabActive="tabActive" :subTabActive="subTabActive1" :subTabList="subTabList1" @changeSub="changeSub"></calendar-box>
      </div>
      <div v-show="tabActive === 2">
        <calendar-box :month="month" :data="tabList2" :tabActive="tabActive" :subTabActive="subTabActive2" :subTabList="subTabList2" @changeSub="changeSub"></calendar-box>
      </div>
      <div v-show="tabActive === 3">
        <calendar-box :month="month" :data="tabList3" :tabActive="tabActive" :subTabActive="subTabActive3" :subTabList="subTabList3" @changeSub="changeSub"></calendar-box>
      </div>
    </div>
    <sel-picker ref="SelPicker" @selPicker="selPicker"></sel-picker>
  </div>
</template>

<script>
  import CalendarBox from './components/CalendarBox'
  import {toChineseNum,parseTime} from '@/utils/index.js'
  import SelPicker from '@/components/SelPicker'
  import {getMonthProjectTaskInfoByTask,getMonthProjectTaskInfo,getErrorTaskInfo} from '@/api/task'
  export default {
    components:{SelPicker,CalendarBox},
    data(){
      return {
        tabActive:0,
        subTabActive:'',
        planname:'',
        id:'',
        month:"",
        tabList0:[], //任务总览
        tabList1:[],//房间视图数据
        tabList2:[], //人员
        tabList3:[],//分组
        subTabActive1:'',
        subTabActive2:'',
        subTabActive3:'',
        subTabList1:[],
        subTabList2:[],
        subTabList3:[],
      }
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        }
      },
      taskData:{
        get(){
          let planData = this.$store.getters.planData
          planData.daylist = planData.daylist.toString()
          planData.usernamelist = eval(planData.usernamelist)
          planData.roomnamelist = eval(planData.roomnamelist)
          return planData
        },
        set(data){
          this.$store.commit('SET_PLAN_DATA',data)
        }
      }
    },
    beforeDestroy(){
      this.taskData = {}
    },
    mounted() {
      this.id = this.$route.query.id
      this.planname = this.$route.query.planname

      let time = new Date().getTime()
      let nowDate = parseTime(time,'{y}-{m}')
      this.month = nowDate

      this.initSubList()

      this.getData()

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
      initSubList(){
        let roomnamelist = this.taskData.roomnamelist
        this.subTabList1 = roomnamelist

        let usernamelist = this.taskData.usernamelist
        if(this.taskData.usertype === 1){ //人员
          this.subTabList2 = usernamelist
        }else{
          this.subTabList3 = usernamelist
        }

      },
      getData(){
        let param = {
          month:this.month,
          taskplanid:this.id,
          projectid:this.project.id
        }
        getMonthProjectTaskInfoByTask(param).then(res=>{
          if(res.code === 200){
            this.tabList0 = res.data
          }else{
            this.tabList0 = []
          }
        })
      },
      changeSub(sub,index){ //切换二级tab
        if(index === 1){ //房间
          this.subTabActive1 = sub
        }else if(index === 2){ //人员
          this.subTabActive2 = sub
        }else if(index === 3){ //分组
          this.subTabActive3 = sub
        }
        this.getOtherData(sub,index)
      },
      getOtherData(name,tab){
        let param = {
          month:this.month,
          taskplanid:this.id,
          name:name,
          type:this.tabActive,
          projectid:this.project.id
        }
        getMonthProjectTaskInfo(param).then(res=>{
          if(res.code === 200){
            let data = res.data
            if(tab === 1){ //房间
              this.tabList1 = data
            }else if(tab === 2){ //人员
              this.tabList2 = data
            }else if(tab === 3){//分组
              this.tabList3 = data
            }
          }else{
            this.tabList1 = []
            this.tabList2 = []
            this.tabList3 = []
          }
        })
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      },
      selPicker(val){ //切换时间
        this.month = val
        this.tabList0 = []
        this.tabList1 = []
        this.tabList2 = []
        this.tabList3 = []

        if(this.tabActive === 0){
          this.getData()
        }else {
          let subTabActive = this.tabActive == 1 ? this.subTabActive1 : (this.tabActive == 2 ? this.subTabActive2 : this.subTabActive3)
          this.getOtherData(subTabActive,this.tabActive)
        }
      },
      changeTab(tab){
        // 0任务 1房间  2人员  3分组
        this.tabActive = tab
        if(tab === 0){
          if(this.tabList0.length === 0){
            this.getData()
          }
        }else{
          if(tab === 1){
            if(this.tabList1.length === 0 || this.subTabActive1 === ''){
              this.subTabActive1 = this.subTabList1[0]
              this.getOtherData(this.subTabActive1,tab)
            }
          }else if(tab === 2){
            if(this.tabList2.length === 0 || this.subTabActive2 === ''){
              this.subTabActive2 = this.subTabList2[0]
              this.getOtherData(this.subTabActive2,tab)
            }
          }else if(tab === 3){
            if(this.tabList3.length === 0 || this.subTabActive3 === ''){
              this.subTabActive3 = this.subTabList3[0]
              this.getOtherData(this.subTabActive3,tab)
            }
          }
        }
      },
      chineseNum(val){
        if(!val){
          return ''
        }
        let month = val.split('-')[1]
        let data = month >= 10 ? month :(month.length > 1 ? month.split('')[1] : month)
        return toChineseNum(data)
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
  padding: 80px 0 11px;
}
.fixed-box {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  background-color: #ffffff;
  z-index: 100;
  padding: 16px 16px 0;
}
.tab-content {
  display: flex;
  align-items: center;
  padding: 11px 0;
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
.sub-tab-content {
  display: flex;
  margin: 10px 0 0 -16px;
  .sub-tab-box {
    display: -webkit-box;
    overflow-x: scroll;
    white-space:nowrap;
    -webkit-overflow-scrolling:touch;
    flex:2;
    font-size: 14px;
    font-weight: 400;
    color: #808896;
    border-bottom: 1px solid #eaedf1;
    &::-webkit-scrollbar {
      width:0;
      height:0;
      display: none;
    }
    .sub-tab {
      display: inline-block;
      margin:0 6px;
      padding: 7px 0 7px;
      &.active {
        color: #333333;
        border-bottom: 2px solid rgba(37,116,240,1);
        font-weight: 600;
      }
    }
  }
  .sub-items {
    width:32px;
    height:36px;
    background-color: #ffffff;
    border-left: 1px solid #eaedf1;
    border-bottom: 1px solid #eaedf1;
  }
  .icon-search {
    width: 16px;
    height:16px;
    margin:8px 0 0 14px;
  }
}
.calendar-box {
  padding-top: 25px;
}
.abnormal-box {
  margin-top: 24px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16px;
  }
  .abnormal-item {
    height: 76px;
    background: #f7f7f8;
    border-radius: 6px;
    padding:12px;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .abnormal-item-content {
    display: flex;
    justify-content: space-between;
    color: #808896;
  }
  .abnormal-left {
    flex: 2;
  }
  .head {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 12px;
    @include  textoverflow()
  }
  .status {
    font-size: 14px;
    font-weight: 400;
    color: #ed4f2a;
    margin-bottom: 12px;
    text-align: right;
  }
  .icon-daka,.icon-shichang {
    width:16px;
    height:16px;
    margin-right: 4px;
    vertical-align: middle;
  }
  .num {
    color:#333333;
    display: inline-block;
    margin-left: 4px;
  }
}
</style>

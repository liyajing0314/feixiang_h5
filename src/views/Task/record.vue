<template>
  <div class="container">
    <div class="title">{{planname}}</div>
    <div class="line"></div>
    <div class="content">
      <div class="tab-content">
        <div class="items" @click="switchTime">
          <span>{{chineseNum(month)}}月</span>
          <img src="@/assets/images/icon_change.png"
            srcset='../../assets/images/icon_change.png 1x,
                     ../../assets/images/icon_change@2x.png 2x' class="icon-change"/>
        </div>
        <div class="tab-box" ref="tab_box">
          <span class="tab" :class="{'active':tabActive===0}" @click="changeTab(0)">任务总览</span>
          <span class="tab" :class="{'active':tabActive===1}" @click="changeTab(1)">房间视图</span>
          <span class="tab" :class="{'active':tabActive===2}" @click="changeTab(2)" v-if="taskData.usertype === 1">人员视图</span>
          <span class="tab" :class="{'active':tabActive===3}" @click="changeTab(3)" v-if="taskData.usertype === 2">分组视图</span>
        </div>
      </div>
      <div class="sub-tab-content" v-if="tabActive !== 0 && subTabList.length >0">
        <div class="sub-tab-box" ref="tabBox">
          <span :ref="'tab'+index" class="sub-tab" :class="{'active':subTabActive === item}" v-for="(item,index) in subTabList" :key="item" @click="changeSubTab(item)">{{item}}</span>
        </div>
        <div class="sub-items" @click="showSelect">
          <img src="@/assets/images/task/icon_search@2x.png" class="icon-search"/>
        </div>
      </div>
      <div class="calendar-box">
        <calendar-single :month="month" :data="calendarList" @selCalendar="selCalendar"></calendar-single>
        <div class="abnormal-box" v-if="errorList.length >0">
          <div class="title">异常情况</div>
          <div class="abnormal-item" v-for="item in errorList" :key="item.id">
            <div class="head">{{item.pname}}</div>
            <div class="abnormal-item-content">
              <div class="abnormal-left">
                <img src="@/assets/images/task/icon_daka@2x.png" class="icon-daka"/>
                <span>打卡次数</span>
                <span class="num">{{item.cts}}</span>
              </div>
              <div>
                <img src="@/assets/images/task/icon_shichang@2x.png" class="icon-daka"/>
                <span>停留时长</span>
                <span class="num">{{item.time}}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <sel-picker ref="SelPicker" @selPicker="selPicker"></sel-picker>
    <select-people-single ref="selectPeople" :list="subTabList" @selPeople="selSubTab"></select-people-single>
    <select-room-single ref="selectRoom" :list="subTabList" @selRoom="selSubTab"></select-room-single>
    <select-group-single ref="selectGroup" :list="subTabList" @selGroup="selSubTab" ></select-group-single>
  </div>
</template>

<script>
  import SelectGroupSingle from '@/components/SelectGroupSingle'
  import SelectRoomSingle from '@/components/SelectRoomSingle'
  import SelectPeopleSingle from '@/components/SelectPeopleSingle'
  import {toChineseNum,parseTime} from '@/utils/index.js'
  import SelPicker from '@/components/SelPicker'
  import {roomList,employeeList,groupList} from '@/api/common'
  import {getMonthProjectTaskInfoByTask,getMonthProjectTaskInfo,getErrorTaskInfo} from '@/api/task'
  import CalendarSingle from '@/components/CalendarSingle'
  export default {
    components:{CalendarSingle,SelPicker,SelectPeopleSingle,SelectRoomSingle,SelectGroupSingle},
    data(){
      return {
        tabActive:0,
        subTabActive:'',
        planname:'',
        id:'',
        month:"",
        calendarList:[],
        subTabList:[],
        errorList:[]
      }
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        }
      },
      taskData(){
        let planData = this.$store.getters.planData
        planData.daylist = planData.daylist.toString()
        planData.usernamelist = eval(planData.usernamelist)
        planData.roomnamelist = eval(planData.roomnamelist)
        return planData
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.planname = this.$route.query.planname

      let time = new Date().getTime()
      let nowDate = parseTime(time,'{y}-{m}')
      this.month = nowDate

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
      getData(){
        let param = {
          month:this.month,
          taskplanid:this.id,
          projectid:this.project.id
        }
        getMonthProjectTaskInfoByTask(param).then(res=>{
          if(res.code === 200){
            this.calendarList = res.data
          }else{
            this.calendarList = []
          }
        })
      },
      getOtherData(){
        let param = {
          month:this.month,
          taskplanid:this.id,
          name:this.subTabActive,
          type:this.tabActive,
          projectid:this.project.id
        }
        getMonthProjectTaskInfo(param).then(res=>{
          if(res.code === 200){
            this.calendarList = res.data
          }else{
            this.calendarList = []
          }
        })
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      },
      selPicker(val){
        this.month = val
        this.errorList = []
        if(this.tabActive === 0){
          this.getData()
        }else {
          this.getOtherData()
        }
      },
      changeTab(tab){
        // 0任务 1房间  2人员  3分组
        this.tabActive = tab
        if(tab === 0){
          this.getData()
        }else{
          if(tab === 1){
            let roomnamelist = this.taskData.roomnamelist
            this.subTabList = roomnamelist
          }else if(tab === 2){
            let usernamelist = this.taskData.usernamelist
            this.subTabList = usernamelist
          }else if(tab === 3){
            let usernamelist = this.taskData.usernamelist
            this.subTabList = usernamelist
          }
          this.subTabActive = this.subTabList[0]
          this.getOtherData()
        }
        this.errorList = []
      },
      changeSubTab(subTab){
        this.subTabActive = subTab
        this.getOtherData()
      },
      selCalendar(val){
        this.getErrorTaskInfo(val)
      },
      showSelect(){
        console.info('this.tabActive',this.tabActive)
        if(this.tabActive === 1){ //房间
          this.$refs.selectRoom.showPopup('task')
        }else if(this.tabActive === 2){ //人员
          this.$refs.selectPeople.showPopup('task')
        }else if(this.tabActive === 3){ //分组
          this.$refs.selectGroup.showPopup('task')
        }
      },
      selSubTab(item,index){ //筛选房间 /人员 /分组
        this.changeSubTab(item)
        let clientWidth = this.$refs['tab'+index][0].clientWidth
        let left = (clientWidth + 10) * index
        this.$refs.tabBox.scrollTo({
          left: left,
          behavior: "smooth" // 平滑滚动
        })
      },
      getErrorTaskInfo(val){
        let name = ''
        if(this.tabActive !== 0){
          name = this.subTabActive
        }

        let param = {
          data:val.data,
          name:name,
          projectid:this.project.id ,
          taskrecordId:val.taskrecordId ,
          type:this.tabActive + 1 //1 按任务 2 按房间 3 按人员 4按分组
        }
        getErrorTaskInfo(param).then(res=>{
          if(res.code === 200){
            this.errorList = res.data
          }else{
            this.errorList = []
          }
        })
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

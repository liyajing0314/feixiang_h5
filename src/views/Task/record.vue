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
          <span class="tab" :class="{'active':tabActive===2}" @click="changeTab(2)">人员视图</span>
          <span class="tab" :class="{'active':tabActive===3}" @click="changeTab(3)">分组视图</span>
        </div>
      </div>
      <div class="sub-tab-content" v-if="tabActive === 1 && subTabList.length >0">
        <div class="sub-tab-box">
          <span class="sub-tab" :class="{'active':subTabActive.id === item.id}" v-for="item in subTabList" :key="item.id">{{item.roomname || item.name}}</span>
        </div>
        <div class="sub-items">
          <img src="@/assets/images/task/icon_search@2x.png" class="icon-search"/>
        </div>
      </div>
      <div class="calendar-box">
        <calendar-single :month="month" :data="calendarList" @selCalendar="selCalendar"></calendar-single>
        <div class="abnormal-box" v-if="errorList.lenght >0">
          <div class="title">异常情况</div>
          <div class="abnormal-item" v-for="item in errorList" :key="item.id">
            <div class="abnormal-left">
              <div class="head">{{item.taskplanname}}</div>
              <div>{{item.employeename}}</div>
            </div>
            <div>
              <div class="status">{{item.info}}</div>
              <div>{{splitTime(item.starttime)}} - {{splitTime(item.endtime)}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <sel-picker ref="SelPicker" @selPicker="selPicker"></sel-picker>
  </div>
</template>

<script>

  import {toChineseNum} from '@/utils/index.js'
  import SelPicker from '@/components/SelPicker'
  import {roomList,employeeList,groupList} from '@/api/common'
  import {getMonthProjectTaskInfoByTask,getMonthProjectTaskInfo,getErrorList} from '@/api/task'
  import CalendarSingle from '@/components/CalendarSingle'
  export default {
    components:{CalendarSingle,SelPicker},
    data(){
      return {
        tabActive:0,
        subTabActive:{
          id:'',
          name:''
        },
        planname:'',
        id:'',
        month:"2021-07",
        calendarList:[],
        subTabList:[],
        errorList:[]
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.planname = this.$route.query.planname
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
          taskplanid:this.id
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
          name:this.subTabActive.name,
          type:this.tabActive
        }
        getMonthProjectTaskInfo().then(res=>{
          if(res.code === 200){
            this.calendarList = res.data
          }else{
            this.calendarList = []
          }
        })
      },
      getRoomList(){
        let param = {
          projectid:this.id
        }
        roomList(param).then(res=>{
          if(res.code === 200){
            let rows = res.rows
            this.subTabList = rows
            if(rows.length >0){
              this.subTabActive.id = rows[0].id
              this.subTabActive.name = rows[0].roomname
              this.getOtherData()
            }else{
              this.calendarList = []
            }
          }else{
            this.subTabList = []
            this.subTabActive = {
              id:'',
              name:''
            }
          }
        })
      },
      getEmployeeList(){
        let param = {
          projectid:this.id
        }
        employeeList(param).then(res=>{
          if(res.code === 200){
            let rows = res.rows
            this.subTabList = rows
            if(rows.length >0){
              this.subTabActive.id = rows[0].id
              this.subTabActive.name = rows[0].name
              this.getOtherData()
            }else{
              this.calendarList = []
            }
          }else{
            this.subTabList = []
            this.subTabActive = {
              id:'',
              name:''
            }
          }
        })
      },
      getGroupList(){
        let param = {
          projectid:this.id
        }
        groupList(param).then(res=>{
          if(res.code === 200){
            let rows = res.rows
            this.subTabList = rows
            if(rows.length >0){
              this.subTabActive.id = rows[0].id
              this.subTabActive.name = rows[0].name
              this.getOtherData()
            }else{
              this.calendarList = []
            }
          }else{
            this.subTabList = []
            this.subTabActive = {
              id:'',
              name:''
            }
          }
        })
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      },
      selPicker(val){
        this.month = val
        if(this.tabActive === 0){
          this.getData()
        }else {
          this.getOtherData()
        }
      },
      changeTab(tab){
        // 0任务 1房间  2人员  3分组
        if(tab === 0){
          this.getData()
        }else{
          if(tab === 1){
            this.getRoomList()
          }else if(tab === 2){
            this.getEmployeeList()
          }else if(tab === 3){
            this.getGroupList()
          }
          // this.getOtherData()
        }
        this.errorList = []
        this.tabActive = tab
      },
      selCalendar(val){
        if(val.taskrecordIdList.length >0){
          this.getErrorList(val.taskrecordIdList)
        }
      },
      getErrorList(taskrecordIdList){
        getErrorList(taskrecordIdList.toString()).then(res=>{
          if(res.code === 200){
            this.errorList = res.data
          }else{
            this.errorList = []
          }
        })
      },
      chineseNum(val){
        let month = val.split('-')[1]
        let data = month >= 10 ? month :(month.length > 1 ? month.split('')[1] : month)
        return toChineseNum(data)
      },
      splitTime(time){
        let data = time.split(' ')[1]
        let data2= data.split(':')
        return data2[0] + ':' + data2[1]
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
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 8px;
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
}
</style>

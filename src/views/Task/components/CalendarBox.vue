<template>
  <div>
    <div class="sub-tab-content" v-if="subTabList && subTabList.length >0">
      <div class="sub-tab-box" ref="tabBox">
        <span :ref="'tab'+index" class="sub-tab" :class="{'active':subTabActive === item}" v-for="(item,index) in subTabList" :key="item" @click="changeSubTab(item)">{{item}}</span>
      </div>
      <div class="sub-items" @click="showSelect">
        <svg-icon icon-class="icon_search" class-name="icon-search"></svg-icon>
      </div>
    </div>
    <div class="calendar-box">
      <calendar-single :month="month" :data="data" @selCalendar="selCalendar"></calendar-single>
      <div class="abnormal-box" v-if="errorList.length >0">
        <div class="title">异常情况</div>
        <div class="abnormal-item" v-for="item in errorList" :key="item.id">
          <div class="head">{{item.pname}}</div>
          <div class="abnormal-item-content">
            <div class="abnormal-left">
              <svg-icon icon-class="icon_daka" class-name="icon-daka"></svg-icon>
              <span>打卡次数</span>
              <span class="num">{{item.cts}}</span>
            </div>
            <div>
              <svg-icon icon-class="icon_shichang" class-name="icon-daka"></svg-icon>
              <span>停留时长</span>
              <span class="num">{{item.time}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
    <select-people-single ref="selectPeople" :list="subTabList" @selPeople="selSubTab"></select-people-single>
    <select-room-single ref="selectRoom" :list="subTabList" @selRoom="selSubTab"></select-room-single>
    <select-group-single ref="selectGroup" :list="subTabList" @selGroup="selSubTab" ></select-group-single>
  </div>

</template>

<script>
  import SelectGroupSingle from '@/components/SelectGroupSingle'
  import SelectRoomSingle from '@/components/SelectRoomSingle'
  import SelectPeopleSingle from '@/components/SelectPeopleSingle'
  import CalendarSingle from '@/components/CalendarSingle'
  import {getMonthProjectTaskInfoByTask,getMonthProjectTaskInfo,getErrorTaskInfo} from '@/api/task'
  export default {
    props:['month','data','tabActive','subTabList','subTabActive'],
    components:{CalendarSingle,SelectGroupSingle,SelectRoomSingle,SelectPeopleSingle},
    data(){
      return {
        errorList:[],
      }
    },
    mounted() {
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        }
      },
    },
    watch:{
      data(o,n){
        console.info('数据改变')
        this.errorList = []
      }
    },
    methods:{
      changeSubTab(item){
        this.errorList = []
        this.$emit('changeSub',item,this.tabActive)
      },
      showSelect(){
        if(this.tabActive === 1){ //房间
          this.$refs.selectRoom.showPopup('task')
        }else if(this.tabActive === 2){ //人员
          this.$refs.selectPeople.showPopup('task')
        }else if(this.tabActive === 3){ //分组
          this.$refs.selectGroup.showPopup('task')
        }
      },
      selSubTab(item,index){ //筛选房间 /人员 /分组
        // this.changeSubTab(item)
        this.$emit('changeSub',item,this.tabActive)
        let clientWidth = this.$refs['tab'+index][0].clientWidth
        let left = (clientWidth + 10) * index
        this.$refs.tabBox.scrollTo({
          left: left,
          behavior: "smooth" // 平滑滚动
        })
      },
      selCalendar(val){
        this.getErrorTaskInfo(val)
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
    }
  }
</script>

<style scoped lang="scss">
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

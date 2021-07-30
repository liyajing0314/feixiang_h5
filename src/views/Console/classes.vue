<!-- 班次管理 -->
<template>
  <div class="container">
    <roll-tab-box :tabList="tabList" @changeRollTab="changeRollTab"></roll-tab-box>
    <div class="content">
      <month-arrow :month="month" @changeMonth="changeMonth"></month-arrow>
      <div class="items" :class="{'active':activeItem(item) > -1}" :style="{backgroundColor:hexToRgba(item.color,0.1) ? hexToRgba(item.color,0.1).rgba : ''}" v-for="item in list" :key="item.id" @click="selItem(item)">
        <span>
          <span class="month">{{chineseNum(item.data)}}</span>
          <span class="item-satus" :style="{color:item.color}">{{item.scheduleplanName}}</span>
        </span>
      </div>
    </div>
    <div class="bottom-box" v-show="active.length >0">
      <span>已选<span class="activeColor">{{active.length}}</span>个班次</span>
      <span class="update" @click="showPopup">
        <!-- <img src="~@/assets/images/console/icon_update@2x.png" class="icon-update"/> -->
        <svg-icon icon-class="icon_update" class-name="icon-update"></svg-icon>
        修改班次
      </span>
    </div>

    <van-popup v-model="popupShow" round closeable position="bottom" @close="cancelPopup">
      <div class="popup-content">
        <div class="title">
          <span>
            将<span class="activeColor">{{active.length}}</span>个班次修改为
          </span>
        </div>
        <div class="class-list">
          <div class="class-item" :class="{'active':classActive == item.id}" :style="{backgroundColor:hexToRgba(item.color,0.1) ? hexToRgba(item.color,0.1).rgba : '',color:item.color}" v-for="item in classList" :key="item.id" @click="selClassActive(item)">
            <span>
              <span style="flex:2;">{{item.schedulename}}</span>
            </span>
          </div>
        </div>
        <div class="popup-bottom">
          <van-button type="primary" class="btn btn-cancel" @click="cancelPopup">取消</van-button>
          <van-button type="primary" class="btn btn-ok" @click="submit">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import MonthArrow from '@/components/MonthArrow'
  import RollTabBox from '@/components/RollTabBox'
  import {employeeList} from '@/api/common'
  import {getMonthSchedulerecordInfo,updateDaySchedulerecord,getAll} from '@/api/user'
  import {formatterStatus,toChineseNum,parseTime,hexToRgba,debounce} from '@/utils/index'
  export default {
    components:{RollTabBox,MonthArrow},
    data(){
      return {
        tabList:[],
        popupShow:false,
        month:'',
        selEmployee:{},
        list:[],
        classList:[],
        active:[],
        hexToRgba:hexToRgba,
        classActive:''
      }
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        }
      }
    },
    mounted() {
      let time = new Date().getTime()
      let nowDate = parseTime(time,'{y}-{m}')
      this.month = nowDate

      this.getEmployeeList()
    },
    methods:{
      changeRollTab(val){
        this.selEmployee = val
        this.active = []
        this.getMonthSchedulerecordInfo()
        this.getAll()
      },
      getEmployeeList(){ //获取人员列表
        let param = {
          projectid:this.project.id
        }
        employeeList(param).then(res=>{
          if(res.code === 200){
            let rows = res.rows
            this.tabList = rows
            if(rows.length >0){
              this.selEmployee = rows[0]
              this.getMonthSchedulerecordInfo()
              this.getAll()
            }
          }else{
            this.tabList = []
          }
        })
      },
      getMonthSchedulerecordInfo(){
        let param = {
          projectid:this.project.id,
          employeeName:this.selEmployee.name,
          month:this.month,
          type:2, //1考勤2班次
        }
        getMonthSchedulerecordInfo(param).then(res=>{
          if(res.code === 200){
            this.list = res.data
          }else{
            this.list = []
          }
        })
      },
      getAll(){
        let param = {
          projectid:this.project.id,
          employeeid:this.selEmployee.id
        }
        getAll(param).then(res=>{
          if(res.code === 200){
            this.classList = res.data
          }else{
            this.classList = []
          }
        })
      },
      selItem(item){
        let index = this.active.findIndex(ite=>{
          return ite.data == item.data
        })
        if(index > -1){
          this.active.splice(index,1)
        }else{
          this.active.push(item)
        }
      },
      activeItem(item){
        let index = this.active.findIndex(ite=>{
          return ite.data == item.data
        })
        return index
      },
      changeMonth(val){ //切换月份
        this.month = val
        this.getMonthSchedulerecordInfo()
      },
      chineseNum(val){
        if(!val){
          return ''
        }
        let date = val.split('-')
        let month = date[1]
        let data = month >= 10 ? month :(month.length > 1 ? month.split('')[1] : month)
        return toChineseNum(data) + '月'+date[2]+'日'
      },
      selClassActive(item){
        this.classActive = item.id
      },
      showPopup(){
        this.popupShow = true
      },
      cancelPopup(){
        this.classActive = ''
        this.popupShow = false
      },
      submit:debounce(function(){ //修改班次
        let that = this
        let classobj = this.classList.find(item=>{
          return item.id == this.classActive
        })

        let promise = []
        this.active.map((item,index)=>{
          let param = {
            projectid:this.project.id,
            schedulerecordId:item.id || '',
            employeeId:this.selEmployee.id,
            scheduleplanId:classobj.scheduleid,
            recordDate:item.data
          }
          promise[index] = this.update(param)
        })

        Promise.all(promise).then(function(results){
          that.active = []
          that.classActive = ''
          that.popupShow = false
          that.getMonthSchedulerecordInfo()
        }).catch(function(err){
            console.log(err);
        });
      },500),
      update(param){

        return new Promise((resolve, reject)=>{
          updateDaySchedulerecord(param).then(res=>{
            if(res.code === 200){
              resolve()
            }else{
              reject()
            }
          }).catch(error=>{
            reject()
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.container {
  background-color: #ffffff;
  min-height: 100vh;
}
.month-arrow {
  @include flexbox();
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 600;
  .icon-arrow {
    width:24px;
    height:24px;
  }
}
.content {
  padding:20px 12px 60px;
}
.items {
  height: 36px;
  background: rgba(102,102,102,0.1);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 4px;
  >span {
    @include flexbox();
    padding:0 12px;
    width:99%;
    height:94%;
    top:1px;
  }
  &.active {
    background: #2574f0 !important;
    color:#ffffff;
    >span {
      width:99%;
      height:94%;
      margin: 0 auto;
      border:1px solid #ffffff;
      border-radius: 6px;
      position: relative;
      .month {
        padding-left: 16px;
        &:before {
          content:'';
          width:12px;
          height:12px;
          background: url('~@/assets/images/task/icon_dui_bai@2x.png') no-repeat center center / cover;
          position: absolute;
          left:12px;
          top: 10px;
        }
      }
    }
    .item-satus {
      color:#ffffff !important;
    }
  }
}


.bottom-box {
  position: fixed;
  bottom:0;
  left:0;
  width:100%;
  height:60px;
  background-color: #ffffff;
  border-top: 1px solid #eaedf1;
  @include flexbox();
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  .recordStatus {
    display: inline-block;
    margin-left: 12px;
  }
  .update {
    font-weight: 400;
    color: #2574f0;
    cursor: pointer;
  }
  .icon-update {
    width:16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 4px;
  }
}
.activeColor {
  color: #2574f0;
  display: inline-block;
  padding: 0 4px;
}
.popup-content {
  padding: 24px 16px 4px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20px;
  }
  .class-list {
    @include flexbox();
    flex-wrap: wrap;
    max-height: 360px;
    overflow: auto;
    padding-bottom: 84px;
  }
  .class-item {
    width:170px;
    height:36px;
    background: rgba(102,102,102,0.1);
    border-radius: 6px;
    margin-bottom: 9px;
    text-align: center;
    font-size: 14px;
    >span {
      @include flexbox();
      width: 100%;
      height:100%;
      position: relative;
      top: 1px;
    }
    &.active {
      background: #2574f0 !important;
      color:#ffffff !important;
      >span {
        width:99%;
        height:94%;
        margin: 0 auto;
        border:1px solid #ffffff;
        border-radius: 6px;
      }
    }
  }
  .popup-bottom {
    position: absolute;
    width:100%;
    bottom:0;
    left:0;
    padding: 6px 16px;
    background-color: rgba(255,255,255,0.8);
  }
}
.btn {
  border:none;
  width:160px;
  height:44px;
  border-radius: 6px;
  margin-bottom: 38px;
  &:first-of-type {
    margin-right: 23px;
  }
}
</style>

<!-- 考勤管理 -->
<template>
  <div class="container">
    <roll-tab-box :tabList="tabList" @changeRollTab="changeRollTab"></roll-tab-box>
    <div class="content">
      <div class="box">
        <span><img src=""/>上班打卡：<span class="time">{{formatterTime(workTime.firstTime)}}</span></span>
        <span><img src=""/>下班打卡：<span class="time" :class="{'notime':formatterTime(workTime.lastTime) === '暂无'}">{{formatterTime(workTime.lastTime)}}</span></span>
      </div>

      <div>
        <!-- <div class="month-arrow">
          <img src="~@/assets/images/console/icon_left.png" class="icon-arrow" @click="changMonth('minus')"/>
          <span>2021年七月</span>
          <img src="~@/assets/images/console/icon_right.png" class="icon-arrow" @click="changMonth('add')"/>
        </div> -->
        <month-arrow></month-arrow>
        <calendar-record :month="month" :data="calendarList" @selCalendar="selCalendar"></calendar-record>
      </div>
      <div class="bottom-box" v-if="JSON.stringify(calendarActive) != '{}'">
        <span>
          <span>{{chineseNum(calendarActive.data)}}</span>
          <span class="recordStatus" :class="'status'+calendarActive.status">{{formatterStatus(calendarActive.status)}}</span>
        </span>
        <span class="update" @click="updateRecord">
          <span>修改考勤</span>
        </span>
      </div>
    </div>

    <van-popup v-model="popupShow" round closeable position="bottom">
      <div class="popup-content">
        <div class="title">
          <span><span class="popupStatus" :class="'status'+calendarActive.status">{{formatterStatus(calendarActive.status)}}</span>修改为</span>
        </div>
        <div class="status-list">
          <span class="status-item" :class="['status'+item.status,{'active':selStatus === item.status}]" v-for="item in statusCopyList" :key="item.status"
          @click="changeStatus(item)"><span>{{item.label}}</span></span>
        </div>
        <van-field
          v-model="form.remark"
          rows="2"
          autosize
          type="textarea"
          placeholder="请输入备注"
          class="form-field"
        />
        <van-uploader v-model="fileList" multiple />
        <div>
          <van-button type="primary" class="btn btn-cancel">取消</van-button>
          <van-button type="primary" class="btn btn-ok">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import MonthArrow from '@/components/MonthArrow'
  import {formatterStatus,toChineseNum,parseTime} from '@/utils/index'
  import {getOnOffDuty,getMonthSchedulerecordInfo} from '@/api/user'
  import {employeeList} from '@/api/common'
  import RollTabBox from '@/components/RollTabBox'
  import CalendarRecord from '@/components/CalendarRecord'
  export default {
    components:{RollTabBox,CalendarRecord,MonthArrow},
    data(){
      return {
        color:'#1989fa',
        minDate: new Date(2010, 0, 1),
        maxDate: new Date(2010, 0, 31),
        tabList:[],
        workTime:{},
        id:22,
        month:'',
        calendarList:[],
        calendarActive:{},
        formatterStatus:formatterStatus,
        popupShow:false,
        form:{
          remark:''
        },
        fileList:[],
        statusList:[
          {label:'未打卡',status:0},
          {label:'正常',status:1},
          {label:'迟到',status:2},
          {label:'早退',status:3},
          {label:'旷工',status:4},
          {label:'病假',status:5},
          {label:'事假',status:6},
          {label:'外出',status:7},
          {label:'调休',status:8},
          {label:'休息',status:9},
          {label:'加班',status:10},
        ],
        statusCopyList:[],
        selStatus:0,
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
        this.getOnOffDuty(val.id)
        this.getMonthSchedulerecordInfo(val.name)
      },
      selCalendar(val){
        this.calendarActive = val
      },
      getMonthSchedulerecordInfo(employeeName){
        let param = {
          projectid:this.id,
          employeeName:employeeName,
          month:this.month,
          type:1, //1考勤2班次
        }
        getMonthSchedulerecordInfo(param).then(res=>{
          if(res.code === 200){
            this.calendarList = res.data
          }else{
            this.calendarList = []
          }
        })
      },
      getEmployeeList(){ //获取人员列表
        let param = {
          projectid:this.id
        }
        employeeList(param).then(res=>{
          if(res.code === 200){
            let rows = res.rows
            this.tabList = rows
            if(rows.length >0){
              let employeeId = rows[0].id
              let employeeName = rows[0].name
              this.getOnOffDuty(employeeId)
              this.getMonthSchedulerecordInfo(employeeName)
            }

          }else{
            this.tabList = []
          }
        })
      },
      getOnOffDuty(employeeId){ //考勤上下班时间
        let param = {
          employeeId:employeeId,
          projectid:this.id
        }
        getOnOffDuty(param).then(res=>{
          if(res.code === 200){
            this.workTime = res.data
          }else{
            this.workTime = {}
          }
        })
      },
      formatterTime(time){
        if(time){
          let time1 = time.split(' ')[1]
          return time1
        }else{
          return '暂无'
        }
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
      updateRecord(){
        let status = this.calendarActive.status
        this.statusCopyList = JSON.parse(JSON.stringify(this.statusList))
        let index = this.statusCopyList.findIndex(item=>item.status === status)
        this.statusCopyList.splice(index,1)
        this.selStatus = this.statusCopyList[0].status
        this.popupShow = true
      },
      changeStatus(item){
        this.selStatus = item.status
      },
      changMonth(type){
        if(type === 'minus'){ //减月份

        }else{

        }
      }
    }
  }
</script>

<style scoped lang="scss">
.container {
  background-color: #ffffff;
  min-height: 100vh;
}
.content {
  padding:13px 16px 60px ;
}
.box {
  background: #f7f7f8;
  border-radius: 6px;
  height:48px;
  padding: 12px;
  @include flexbox();
  font-size: 14px;
  color: #808896;
  margin-bottom: 24px;
  >span {
    flex: 1;
    padding-left: 16px;
  }
  >span:first-of-type {
    border-right: 1px solid #eaedf1;
  }
  .time {
    color: #333333;
    display: inline-block;
    margin-left: 6px;
  }
  .notime {
    color: #bac2ce;
  }
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
}
.status0 {
  color: #bfc5ce;
}
.status1 {
  color: #65c8b8;
}
.status2 {
  color: #a2ab2c;
}
.status3 {
  color: #ffa042;
}
.status4 {
  color: #f05d4f;
}
.status5 {
  color: #8e53d0;
}
.status6 {
  color: #0084ff;
}
.status7 {
  color: #537eb0;
}
.status8 {
  color: #999999;
}
.status9 {
  color: #bfc5ce;
}
.status10 {
  color: #ba4f15;
}

.popup-content {
  padding: 24px 16px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20px;
  }
  .popupStatus {
    display: inline-block;
    margin-right: 4px;
  }
  .status-list {
    margin: 0 -6px;
    .status0 {
      background-color: rgba(191,197,206,0.1);
    }
    .status1 {
      background-color: rgba(101,200,184,0.1);
    }
    .status2 {
      background-color: rgba(255,160,66,0.10);
    }
    .status3 {
      background-color: rgba(162,171,44,0.1);
    }
    .status4 {
      background-color:rgba(237,79,42,0.10);
    }
    .status5 {
      background-color:rgba(142,83,208,0.1);
    }
    .status6 {
      background-color: rgba(0,132,255,0.1);
    }
    .status7 {
      background-color: rgba(83,126,176,0.1);
    }
    .status8 {
      background-color: rgba(153,153,153,0.1);
    }
    .status9 {
      background-color: rgba(153,153,153,0.1);
    }
    .status10 {
      background-color:rgba(186,79,21,0.1);
    }
  }
  .status-item {
    width: 60px;
    height: 36px;
    border-radius: 6px;
    margin:6px 5px;
    text-align: center;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    >span {
      display: inline-block;
      width: 96%;
      height: 95%;
      border-radius: 6px;
      line-height: 32px;
    }
    &.active {
      background: #2574f0;
      color:#ffffff;
      >span {
        border: 1px solid #ffffff;
      }
    }
  }
}
.form-field {
  border: 1px solid #eaedf1;
  border-radius: 6px;
  margin: 16px 0;
}
.btn {
  border:none;
  width:160px;
  height:44px;
  border-radius: 6px;
  margin-top: 30px;
  margin-bottom: 38px;
  &:first-of-type {
    margin-right: 23px;
  }
}
</style>

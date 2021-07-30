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
        <month-arrow :month="month" @changeMonth="changeMonth"></month-arrow>
        <calendar-record :month="month" :data="calendarList" @selCalendar="selCalendar"></calendar-record>
      </div>
      <div class="bottom-box" v-if="JSON.stringify(calendarActive) != '{}'">
        <span>
          <span>{{chineseNum(calendarActive.data)}}</span>
          <span class="recordStatus" :class="'status'+calendarActive.status">{{formatterStatus(calendarActive.status)}}</span>
        </span>
        <span class="update" @click="updateRecord">
          <svg-icon icon-class="icon_update" class-name="icon-update"></svg-icon>
          <span>修改考勤</span>
        </span>
      </div>
    </div>

    <van-popup v-model="popupShow" round closeable position="bottom" @close="popupClose">
      <div class="popup-content">
        <div class="title">
          <span><span class="popupStatus" :class="'status'+calendarActive.status">{{formatterStatus(calendarActive.status)}}</span>修改为</span>
        </div>
        <div class="status-list">
          <span class="status-item" :class="['status'+item.status,{'active':selStatus === item.status}]" v-for="item in statusCopyList" :key="item.status"
          @click="changeStatus(item)"><span>{{item.label}}</span></span>
        </div>
        <van-field
          v-model="remark"
          rows="2"
          autosize
          type="textarea"
          placeholder="请输入备注"
          class="form-field"
        />
        <van-uploader v-model="fileList" :max-count="1" :before-read="beforeRead"/>
        <div>
          <van-button type="primary" class="btn btn-cancel" @click="popupClose">取消</van-button>
          <van-button type="primary" class="btn btn-ok" @click="submit">确认</van-button>
        </div>
      </div>

    </van-popup>
  </div>
</template>

<script>
  import MonthArrow from '@/components/MonthArrow'
  import {formatterStatus,toChineseNum,parseTime,debounce} from '@/utils/index'
  import {getOnOffDuty,getMonthSchedulerecordInfo,updateSchedulerecordStatus,getRecord} from '@/api/user'
  import {employeeList} from '@/api/common'
  import RollTabBox from '@/components/RollTabBox'
  import CalendarRecord from '@/components/CalendarRecord'
  export default {
    components:{RollTabBox,CalendarRecord,MonthArrow},
    data(){
      return {
        tabList:[],
        workTime:{},
        month:'',
        calendarList:[],
        calendarActive:{},
        formatterStatus:formatterStatus,
        popupShow:false,
        remark:'',
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
        selEmployee:{},//选中的人员对象
        recordDetail:{}
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
      changeRollTab(val){ //切换人员
        let name = val.name
        this.selEmployee = val
        this.getOnOffDuty(val.id)
        this.getMonthSchedulerecordInfo()
      },
      selCalendar(val){
        this.calendarActive = val
        // this.getRecord(val.id)
      },
      //查看某人某月考勤
      getMonthSchedulerecordInfo(){
        let param = {
          projectid:this.project.id,
          employeeName:this.selEmployee.name,
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
          projectid:this.project.id
        }
        employeeList(param).then(res=>{
          if(res.code === 200){
            let rows = res.rows
            this.tabList = rows
            if(rows.length >0){
              this.selEmployee = rows[0]
              this.getOnOffDuty()
              this.getMonthSchedulerecordInfo()
            }

          }else{
            this.tabList = []
          }
        })
      },
      getOnOffDuty(employeeId){ //考勤上下班时间
        let param = {
          employeeId:this.selEmployee.id,
          projectid:this.project.id
        }
        getOnOffDuty(param).then(res=>{
          if(res.code === 200){
            this.workTime = res.data
          }else{
            this.workTime = {}
          }
        })
      },
      getRecord(id){
        getRecord(id).then(res=>{
          if(res.code === 200){
            let data = res.data
            this.recordDetail = data
            if(data.imageurl && data.imageurl != ''){
              this.fileList = [{url: data.imageurl}]
            }else{
              this.fileList = []
            }
            this.remark = data.remark
          }else{
            this.recordDetail = {}
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
      changeMonth(val){//切换月份
        this.calendarActive = {}
        this.month = val
        this.getMonthSchedulerecordInfo()
      },
      popupClose(){
        this.fileList = []
        this.remark = ''
        this.popupShow = false
      },
      beforeRead(file){
        let flag = file.type === 'image/jpeg' || file.type === 'image/png'
        if(!flag) {
          this.$toast('请上传 jpg 格式图片');
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          this.$toast('上传图片大小不得超过5MB');
          return false;
        }
        return true;
      },
      submit:debounce(function(){ //修改考勤
        let that = this

        let file = this.fileList.length >0 ? this.fileList[0].file : ''

        let formData = new FormData()
        formData.append('projectid',this.project.id)
        formData.append('recordID',this.calendarActive.id || '')
        formData.append('status',this.selStatus)
        formData.append('file',file)
        formData.append('remark',this.remark)
        formData.append('employeeId',this.selEmployee.id)
        formData.append('recordDate',this.calendarActive.data)


        updateSchedulerecordStatus(formData).then(res=>{
          if(res.code === 200){
            that.popupShow = false
            that.selStatus = 0
            that.getMonthSchedulerecordInfo()
          }else{
            that.$toast(res.msg || '修改失败！')
          }
        })
      },500)
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
  .icon-update {
    width:16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 4px;
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

<!-- 班次管理 -->
<template>
  <div class="container">
    <roll-tab-box :tabList="tabList" @changeRollTab="changeRollTab"></roll-tab-box>
    <div>
      <div class="month-arrow">
        <img src="~@/assets/images/console/icon_left.png" class="icon-arrow"/>
        <span>2021年七月</span>
        <img src="~@/assets/images/console/icon_right.png" class="icon-arrow"/>
      </div>
      <calendar-record :month="month" :data="calendarList" @selCalendar="selCalendar"></calendar-record>
    </div>
    <div class="content">
      <div class="items active">
        <span>
          <span class="month">七月1日</span>
          <span class="item-satus">早班(8h)</span>
        </span>
      </div>
      <div class="items">
        <span>
          <span class="month">七月1日</span>
          <span class="item-satus">早班(8h)</span>
        </span>
      </div>
    </div>
    <div  class="bottom-box">
      <span>已选<span>1</span>个班次</span>
      <span>
        <img src=""/>
        修改班次
      </span>
    </div>

    <van-popup v-model="popupShow" round closeable position="bottom">
      <div class="popup-content">
        <div class="title">
          <span>
            将<span>2</span>个班次修改为
          </span>
        </div>
        <div>

        </div>
        <div>
          <van-button type="primary" class="btn btn-cancel">取消</van-button>
          <van-button type="primary" class="btn btn-ok">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import RollTabBox from '@/components/RollTabBox'
  export default {
    components:{RollTabBox},
    data(){
      return {
        tabList:[],
        popupShow:false
      }
    },
    mounted() {
      this.getEmployeeList()
    },
    methods:{
      changeRollTab(val){

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
  padding:12px;
}
.items {
  height: 36px;
  background: rgba(84,176,117,0.1);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 4px;
  >span {
    @include flexbox();
    padding: 12px;
    display: block;
    width: 100%;
    height: 100%;
  }
  &.active {
    background: #2574f0;
    color:#ffffff;
    >span {
      width:95%;
      height:95%;
      margin: 0 auto;
      border:#ffffff;
      border-radius: 6px;
      position: relative;
      .month {
        :before {
          content:'';
          width:12px;
          height:12px;
          background: url('~@/assets/images/task/icon_dui_bai.png') no-repeat center center / cover;
          position: absolute;
          left:12px;
        }
      }
    }
    .item-satus {
      color:#ffffff;
    }
  }
}

.status0 {
  background-color: rgba(191,197,206,0.1);
  .item-satus {
    color: #bfc5ce;
  }
}
.status1 {
  background-color: rgba(101,200,184,0.1);
  .item-satus {
    color: #65c8b8;
  }
}
.status2 {
  background-color: rgba(255,160,66,0.10);
  .item-satus {
    color: #a2ab2c;
  }
}
.status3 {
  background-color: rgba(162,171,44,0.1);
  .item-satus {
    color: #ffa042;
  }
}
.status4 {
  background-color:rgba(237,79,42,0.10);
  .item-satus {
    color: #f05d4f;
  }
}
.status5 {
  background-color:rgba(142,83,208,0.1);
  .item-satus {
    color: #8e53d0;
  }
}
.status6 {
  background-color: rgba(0,132,255,0.1);
  .item-satus {
    color: #0084ff;
  }
}
.status7 {
  background-color: rgba(83,126,176,0.1);
  .item-satus {
    color: #537eb0;
  }
}
.status8 {
  background-color: rgba(153,153,153,0.1);
  .item-satus {
    color: #999999;
  }
}
.status9 {
  background-color: rgba(153,153,153,0.1);
  .item-satus {
    color: #bfc5ce;
  }
}
.status10 {
  background-color:rgba(186,79,21,0.1);
  .item-satus {
    color: #ba4f15;
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
</style>

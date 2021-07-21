<template>
  <div class="container">
    <div class="container-top">
      <p class="title">{{data.planname}}</p>
      <div class="task-info">
        <div class="task-line">
          <span class="label">完成条件</span>
          <span class="cont">{{data.finishCondition}}</span>
        </div>
        <div class="task-line">
          <img src="@/assets/images/task/icon_zq.png"
          srcset='../../assets/images/task/icon_zq.png 1x,
                 ../../assets/images/task/icon_zq@2x.png 2x' class="icon-info"/>
          <span class="label">任务周期</span>
          <div class="task-contet">
            <span>{{data.cycle}}</span>
          </div>
        </div>
        <div class="task-line">
          <img src="@/assets/images/task/icon_pc.png"
          srcset='../../assets/images/task/icon_pc.png 1x,
                 ../../assets/images/task/icon_pc@2x.png 2x' class="icon-info"/>
          <span class="label">任务频次</span>
          <div class="task-contet">
            <span>{{data.frequency}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container-bottom">
      <div class="bottom-pannel">
        <div class="pannel-head">
          <img src="@/assets/images/task/icon_relation_ry.png"
          srcset='../../assets/images/task/icon_relation_ry.png 1x,
                 ../../assets/images/task/icon_relation_ry@2x.png 2x' class="icon-relation"/>
          <span>关联人员</span>
        </div>
        <div class="pannel-body">
          <span class="tag tag1" v-for="(item,index) in data.usernamelist">{{item}}</span>
        </div>
      </div>
      <div class="bottom-pannel">
        <div class="pannel-head">
          <img src="@/assets/images/task/icon_relation_fz.png"
          srcset='../../assets/images/task/icon_relation_fz.png 1x,
                 ../../assets/images/task/icon_relation_fz@2x.png 2x' class="icon-relation"/>
          <span>关联分组</span>
        </div>
        <div class="pannel-body">
          <span class="tag tag2" v-for="(item,index) in data.userlist" :key="index">{{item.jobs}}</span>
        </div>
      </div>
      <div class="bottom-pannel">
        <div class="pannel-head">
          <img src="@/assets/images/task/icon_relation_fj.png"
          srcset='../../assets/images/task/icon_relation_fj.png 1x,
                 ../../assets/images/task/icon_relation_fj@2x.png 2x' class="icon-relation"/>
          <span>关联房间</span>
        </div>
        <div class="pannel-body">
          <span class="tag tag3" v-for="(item,index) in data.roomnamelist">{{item}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {taskPlanDetail} from '@/api/task.js'
  export default {
    data(){
      return{
      }
    },
    mounted() {
    },
    computed:{
      data(){
        let planData = this.$store.getters.planData
        planData.daylist = planData.daylist.toString()
        planData.usernamelist = eval(planData.usernamelist)
        planData.userlist = eval(planData.userlist)
        planData.roomnamelist = eval(planData.roomnamelist)
        return planData
      }
    },
    methods:{

    }
  }
</script>

<style scoped lang="scss">
  .container-top {
    padding: 16px;
    background-color: #F7F7F8;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      margin: 0 0 16px 0;
    }
    .task-info {
      background: rgba(37,116,240,0.10);
      border: 2px solid rgba(37,116,240,0.10);
      border-radius: 6px;
      padding:12px;
    }
    .task-line {
      display: flex;
      margin-bottom: 12px;
    }
    .label {
      color: #808896;
      font-size: 14px;
      margin-right: 8px;
      display: inline-block;
    }
    .cont {
      font-size: 14px;
      color: #2574f0;
      font-weight: 600;
    }
    .icon-info {
      width:16px;
      height:16px;
      margin-right: 6px;
      vertical-align: middle;
      margin-top: 2px;
    }
    .task-contet {
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      flex: 2;
    }
  }
  .container-bottom {
    background: #ffffff;
    border-radius: 12px 12px 0px 0px;
    padding:0 16px;
    min-height: calc(100vh - 190px);
    .bottom-pannel {
      padding: 16px 0 6px;
      border-bottom: 1px solid #eaedf1;
      .pannel-head {
        font-size: 14px;
        font-weight: 600;
      }
      .pannel-body {
        padding-top: 12px;
      }
      .tag {
        background: rgba(37,116,240,0.10);
        border-radius: 12px;
        padding: 2px 10px;
        display: inline-block;
        margin-right: 4px;
        margin-bottom: 10px;
      }
      .tag1 {
        color: #2574f0;
        font-size: 14px;
      }
      .tag2 {
        background: rgba(122,90,229,0.11);
        color: #7a5ae5;
      }
      .tag3 {
        background: rgba(242,140,76,0.10);
        color: #f28c4c;
      }
      .icon-relation {
        width: 12px;
        height: 12px;
        margin-right: 6px;
      }
    }
  }
</style>

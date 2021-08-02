<template>
  <div class="container">
    <div class="project" @click="switchItems">
      <span v-if="project">{{project.name}}</span>
      <svg-icon icon-class="icon_change" class-name="icon-change"></svg-icon>
    </div>
    <div class="task-num">
      <div>
        <p class="title">{{yesterdayTaskUserNum}}</p>
        <p class="desc">昨日任务人数</p>
      </div>
      <div>
        <div class="task-box">
          <span>
            <!-- <img src="@/assets/images/task/icon_wc@2x.png" class="icon-wc"/> -->
            <svg-icon icon-class="icon_wc" class-name="icon-wc"></svg-icon>
            <span>昨日完成人数</span>
          </span>
          <span class="num">{{finish || 0}}</span>
        </div>
        <div class="task-box">
          <span>
            <!-- <img src="@/assets/images/task/icon_wwc@2x.png" class="icon-wc"/> -->
            <svg-icon icon-class="icon_wwc" class-name="icon-wc"></svg-icon>
            <span>昨日未完成人数</span>
          </span>

          <span class="num">{{notFinish}}</span>
        </div>
      </div>
    </div>
    <div>
      <p class="t-title">任务列表</p>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
          <div class="list-item" v-for="(item,index) in list" :key="item.id" v-if="list.length">
            <div @click="toDetail(item)" style="flex:2">
              <p class="l-title">{{item.planname}}</p>
              <div>
                <span class="tag tag-b">{{item.userNum}}人</span>
                <span class="tag tag-o">{{item.roomNum}}房间</span>
              </div>
            </div>
            <div>
              <div class="progress" :class="selStatus(item)">
                <span>{{item.tbTaskDayInfoVo.percent || '0%'}}</span>
                <span class="progress-line" :style="{width:item.tbTaskDayInfoVo.percent ||0}"></span>
              </div>
              <van-popover v-model="item.showPopover" trigger="click" placement="bottom-end" :actions="item.actions" @select="onSelect">
                <template #reference>
                  <svg-icon icon-class="icon_more" class-name="icon-more"></svg-icon>
                </template>
              </van-popover>
            </div>
          </div>
          <van-empty description="暂无数据" v-else/>
        </van-list>

      </van-pull-refresh>
    </div>
    <select-options ref="SelectOptions" @selProject="selProject"></select-options>
  </div>
</template>

<script>
  import SelectOptions from '@/components/SelectOptions'
  import {
    getYesterdayTaskUserNum,
    getYesterdayTaskInfo,
    taskList,
    deletePlan
  } from '@/api/task'
  import {mapGetters } from 'vuex'
  export default {
    components:{SelectOptions},
    data() {
      return {
        yesterdayTaskUserNum: 0,
        finish: 0,
        notFinish: 0,
        param: {
          projectid: '',
          pageNum: 1,
          pageSize: 10
        },
        list: [],
        loading: false,
        finished: false,
        showPopover: false,
        refreshing: false,
        actions: [{
          id: 1,
          text: '查看报表',
          icon: require('@/assets/images/task/icon_record@2x.png')
        }, {
          id: 2,
          text: '删除',
          icon: require('@/assets/images/task/icon_delete@2x.png')
        }],
      }
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        },
        set(data){
          this.$store.commit('SET_SEL_PROJECT',data)
        }
      }
    },
    watch:{
      project: {
        handler(newName, oldName) {
          this.init()
        },
        immediate: true
      }
    },
    methods: {
      init(){
        if(this.project){
          this.param.projectid = this.project.id

          this.getYesterdayTaskUserNum()
          this.getYesterdayTaskInfo()
        }
      },
      getYesterdayTaskUserNum() {
        getYesterdayTaskUserNum({
          projectid: this.param.projectid
        }).then(res => {
          if (res.code === 200) {
            this.yesterdayTaskUserNum = res.data
          }
        })
      },
      getYesterdayTaskInfo() {
        getYesterdayTaskInfo({
          projectid: this.param.projectid
        }).then(res => {
          if (res.code === 200) {
            this.finish = res.data.finish
            this.notFinish = res.data.notFinish
          }
        })
      },
      onLoad() {
        if (this.refreshing) {
          this.list = [];
          this.param.pageNum = 1
          this.refreshing = false;
        }
        this.getTaskList()
      },
      getTaskList() {
        taskList(this.param).then(res => {
          if (res.code === 200) {
            let total = res.total
            let rows = res.rows

            if(rows.length >0){

              rows.map(item=>{
                let actions = JSON.parse(JSON.stringify(this.actions))
                actions.map(action=>{
                  action.pid = item.id
                  action.planname = item.planname
                  return action
                })
                item.showPopover = false
                item.actions = actions
                return item
              })
              this.list = this.list.concat(rows)
            }


            // 加载状态结束
            this.loading = false;
            if (this.list.length >= total) {
              this.finished = true;
            } else {
              this.param.pageNum += 1
              this.finish = false
            }
          }

        })
      },
      onRefresh() {
        // 清空列表数据
        this.finished = false;
        this.refreshing = true
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.onLoad();
      },
      switchItems() {
        this.$refs.SelectOptions.showAction()
      },
      selProject(val){
        this.project = val
        this.param.projectid = val.id
        this.param.pName = val.name
        // this.getYesterdayTaskUserNum()
        // this.getYesterdayTaskInfo()
        this.onRefresh()

      },
      onSelect(action) {
        console.info('action',action)
        let id = action.id
        if (id === 1) { //查看报表
          let item = this.list.find(item=>{
            return item.id == action.pid
          })
          this.$store.commit('SET_PLAN_DATA',item)

          this.$router.push({ path: '/taskRecord',query:{id:action.pid,planname:action.planname}})
        } else {
          this.$dialog.confirm({
            title: '提示',
            message: '确认要删除此任务吗？',
          })
          .then(() => {
            let pid = action.pid
            deletePlan(pid).then(res=>{
              if(res.code === 200){
                this.$toast('操作成功')
                let index = this.list.findIndex(item=>{
                  return item.id == pid
                })
                this.list.splice(index,1)
              }else{
                this.$toast(res.msg || '删除失败')
              }
            })
          })
          .catch(() => {
            // on cancel
          });
        }
      },
      toDetail(item) {
        this.$store.commit('SET_PLAN_DATA',item)
        this.$router.push('/taskDetail')
      },
      selStatus(item){
        if(item.tbTaskDayInfoVo.status == 3){
          return 'status1'
        }else if(item.tbTaskDayInfoVo.status == 4){
          let percent = item.tbTaskDayInfoVo.percent
          percent = percent.substring(0,percent.indexOf('%'))
          let per = parseFloat(percent)
          if(per >60){
            return 'status2'
          }else{
            return 'status3'
          }
        }else{
          return 'status0'
        }
      }

    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding: 12px;
    background-color: #F7F7F8;
  }

  .project {
    margin-bottom: 24px;
    color: #000508;
    font-weight: 600;
    font-size: 20px;
    display: flex;
    align-items: center;
    >span {
      @include textoverflow()
    }
    .icon-change {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .task-num {
    height: 88px;
    width: 100%;
    background: url('~@/assets/images/task/task_bg.png') no-repeat center center /cover;
    padding: 8px 6px 6px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 24px;
      color: #ffffff;
      margin: 0 0 8px;
    }

    .desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .task-box {
      width: 180px;
      height: 36px;
      line-height: 36px;
      background-color: rgba(243, 252, 246, 0.8);
      color: #808896;
      font-size: 12px;
      padding: 0 12px;
      margin-bottom: 4px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .icon-wc {
      width:16px;
      height:16px;
      margin-right: 6px;
      vertical-align: middle;
      position: relative;
      top:-2px;
    }

    .num {
      color: #333333;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .t-title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }

  .list-item {
    height: 80px;
    background: #ffffff;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;

    .l-title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      margin: 0 0 13px;
    }

    .tag {
      display: inline-block;
      border-radius: 4px;
      padding: 3px 6px;
      margin-right: 6px;
      font-size: 12px;
    }

    .tag-b {
      background: rgba(37, 116, 240, 0.10);
      color: #2574f0;
    }

    .tag-o {
      background: rgba(232, 114, 12, 0.10);
      color: #e8720c;
    }

    .progress {
      min-width: 56px;
      height: 24px;
      line-height: 24px;
      border-radius: 6px;
      font-size: 12px;
      text-align: center;
      position: relative;
      overflow: hidden;

      .progress-line {
        position: absolute;
        height: 100%;
        left: 0;
      }
    }

    .status1 {
      color: #65c8b8;

      .progress-line {
        background-color: rgba(101, 200, 184, 0.1);
      }
    }

    .status2 {
      color: #ffb827;
      border: 1px solid rgba(255, 184, 39, 0.10);

      .progress-line {
        background: rgba(255, 184, 39, 0.10);
      }
    }

    .status3 {
      color: #ed4f2a;
      border: 1px solid rgba(237, 79, 42, 0.10);

      .progress-line {
        color: #ed4f2a;
      }
    }
    .status0 {
      color: #bfc5ce;
      border: 1px solid rgba(191,197,206,0.5);
    }

    .icon-more {
      width: 24px;
      height: 24px;
      display: block;
      margin: 6px 0 0 35px;
      cursor: pointer;
    }
  }

</style>
<style>
  .van-icon__image{
    width:16px;
    height:16px;
    vertical-align: 2px;
  }
</style>

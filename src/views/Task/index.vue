<template>
  <div class="container">
    <div class="project">
      <span>{{param.pName}}</span>
      <img src="@/assets/images/icon_change.png" class="icon-change" @click="switchItems" />
    </div>
    <div class="task-num">
      <div>
        <p class="title">{{yesterdayTaskUserNum}}</p>
        <p class="desc">昨日任务人数</p>
      </div>
      <div>
        <div class="task-box"><span>昨日完成人数</span><span class="num">{{finish || 0}}</span></div>
        <div class="task-box"><span>昨日未完成人数</span><span class="num">{{notFinish}}</span></div>
      </div>
    </div>
    <div>
      <p class="t-title">任务列表</p>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="list-item" v-for="(item,index) in list" :key="item.id">
            <div @click="toDetail(item)" style="flex:2">
              <p class="l-title">{{item.planname}}</p>
              <div>
                <span class="tag tag-b">{{item.userNum}}人</span>
                <span class="tag tag-o">{{item.roomNum}}房间</span>
              </div>
            </div>
            <div>
              <div class="progress" :class="{'status1':item.tbTaskDayInfoVo.status == 3,'status2':item.tbTaskDayInfoVo.status == 4}">
                <span>{{item.tbTaskDayInfoVo.percent}}</span>
                <span class="progress-line" style="width:100%"></span>
              </div>
              <van-popover v-model="item.showPopover" trigger="click" placement="bottom-end" :actions="item.actions" @select="onSelect">
                <template #reference>
                  <span class="more"></span>
                </template>
              </van-popover>
            </div>
          </div>
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
    taskList
  } from '@/api/task'
  export default {
    components:{SelectOptions},
    data() {
      return {
        yesterdayTaskUserNum: 0,
        finish: 0,
        notFinish: 0,
        param: {
          projectid: 22,
          pName:'',
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
          icon: require('@/assets/images/task/icon_record.png')
        }, {
          id: 2,
          text: '删除',
          icon: require('@/assets/images/task/icon_delete.png')
        }],
      }
    },
    mounted() {
      this.getYesterdayTaskUserNum()
      this.getYesterdayTaskInfo()
    },
    methods: {
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
              let actions = this.actions
              actions.map(item=>{
                item.pid = rows[0].id
                item.planname = rows[0].planname
                return item
              })
              rows.map(item=>{
                item.showPopover = false
                item.actions = actions
                return item
              })
            }


            this.list = this.list.concat(rows)
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
        this.param.projectid = val.id
        this.param.pName = val.name
        this.getYesterdayTaskUserNum()
        this.getYesterdayTaskInfo()
        this.onRefresh()
      },
      onSelect(action) {
        let id = action.id
        if (id === 1) { //查看报表
          this.$router.push({ path: '/taskRecord',query:{id:action.pid,planname:action.planname}})
        } else {
          this.$dialog.confirm({
              title: '提示',
              message: '确认要删除此任务吗？',
            })
            .then(() => {
              // on confirm
            })
            .catch(() => {
              // on cancel
            });
        }
      },
      toDetail(item) {
        this.$store.commit('SET_PLAN_DATA',item)
        this.$router.push('/taskDetail')
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

    .icon-change {
      width: 16px;
      height: 16px;
      margin-left: 4px;
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

    .status2 {
      color: #ed4f2a;
      border: 1px solid rgba(237, 79, 42, 0.10);

      .progress-line {
        color: #ed4f2a;
      }
    }

    .more {
      width: 24px;
      height: 24px;
      display: block;
      background: url('~@/assets/images/task/more.png') no-repeat center center / cover;
      margin: 6px 0 0 35px;
      cursor: pointer;

      &:hover {
        background-image: url('~@/assets/images/task/more_active.png');
      }
    }
  }

  /deep/.van-popover__action-icon {
    font-size: 16px;
  }
</style>

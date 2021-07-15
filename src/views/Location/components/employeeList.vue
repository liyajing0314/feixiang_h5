<template>
  <div class="list">
    <div class="list-flex">
      <span class="name">姓名</span>
      <span class="fjh">房间号</span>
      <span class="date">时间</span>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(item,index) in 20" :key="index" class="list-flex list-tr">
        <span class="name">林轮窑</span>
        <span class="fjh">5#2F-东北办公区</span>
        <span class="date">07-01 14:22</span>
      </div>
    </van-list>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        loading: false,
        finished: false,
      }
    },
    methods:{
      onLoad(){

      }
    }
  }
</script>

<style scoped lang="scss">
.list {
  margin-top: 16px;
}
.list-flex {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  margin-bottom: 4px;
  text-align: left;
  font-size: 12px;
  color:#808896;
  >span:not(:last-of-type) {
    margin-right: 10px;
  }
}
.list-tr {
  height:32px;
  background: rgba(37,116,240,0.10);
  border-radius: 6px;
  font-size: 14px;
  .name {
    color:#2574F0;
  }
  .fjh {
    color:#333333;
  }
  .date {
    text-align: right;
  }
}
.name {
  width:70px;
}
.fjh {
  width:150px;
  min-width: 150px;
  @include  textoverflow(1)
}
.date {
  color:#808896;
  width: 80px;
  min-width: 80px;
}
</style>

<template>
  <div class="list">
    <div class="list-flex">
      <span class="name">姓名</span>
      <span class="fjh">房间号</span>
      <span class="date">时间</span>
    </div>
    <div v-for="(item,index) in data" :key="index" class="list-flex list-tr">
      <span class="name">{{item.username}}</span>
      <span class="fjh">{{item.roomName}}</span>
      <span class="date">{{item.time}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props:['data'],
    data(){
      return {
      }
    },
    methods:{
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

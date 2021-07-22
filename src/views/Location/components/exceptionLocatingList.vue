<template>
  <div class="list">
    <div class="list-flex">
      <span class="name">姓名</span>
      <span class="status">情况</span>
    </div>
    <div v-for="(item,index) in data" :key="index" class="list-flex list-tr" :class="{'bac1':item.status === '离岗','bac2':item.status === '信号弱'}">
      <span class="name">{{item.username}}</span>
      <span class="status">{{item.status}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props:['data'],
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
  justify-content: space-between;
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
}
.bac1 {
  background:rgba(237,79,42,0.1);
  .status {
    color:#ED4F2A;
  }
}
.bac2 {
  background-color: rgba(255,184,39,0.1);
  .status {
    color:#FFB827;
  }
}
.name {
  width:100px;
  color:#333333;
}
.status {
  width:160px;
  min-width: 160px;
  @include  textoverflow(1)
}
.date {
  text-align: right;
  color:#808896;
}
</style>

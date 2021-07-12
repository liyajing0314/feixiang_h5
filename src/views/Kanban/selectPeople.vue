<!-- 选择人员 -->
<template>
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%' }">
    <van-index-bar :index-list="indexList">
      <van-index-anchor :index="index+1" v-for="(item,index) in 50">标题{{index+1}}</van-index-anchor>
    </van-index-bar>
  </van-popup>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        indexList:[]
      }
    },
    mounted() {
      let num = 50
      for(let i = 1;i<=num;i++){
        this.indexList.push(i)
      }
    },
    methods:{
      showPopup(){
        this.show = true
      }
    }
  }
</script>

<style>
</style>

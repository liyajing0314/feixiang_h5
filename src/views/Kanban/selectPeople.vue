<!-- 选择人员 -->
<template>
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%' }">内容</van-popup>
</template>

<script>
  export default {
    data() {
      return {
        show: false
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

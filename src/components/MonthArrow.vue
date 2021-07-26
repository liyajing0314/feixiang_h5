<template>
  <div class="month-arrow">
    <img src="~@/assets/images/console/icon_left.png" class="icon-arrow" @click="changMonth('minus')"/>
    <span>2021年七月</span>
    <img src="~@/assets/images/console/icon_right.png" class="icon-arrow" @click="changMonth('add')"/>
  </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    methods:{
      changMonth(type){

      }
    }
  }
</script>

<style scoped lang="scss">
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
</style>

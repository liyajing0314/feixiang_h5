<template>
  <van-nav-bar
    :title="title"
    left-arrow
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
</template>

<script>
  export default {
    props:{
      title:{
        default:'标题',
        type:String
      }
    },
    methods: {
      onClickLeft() {
        // $router.back(-1)
        this.$emit('back')
      },
      onClickRight() {
        Toast('按钮');
      },
    },
  };
</script>

<style>
</style>

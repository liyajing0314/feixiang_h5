<template>
  <div>
    <p>你好，***</p>
    <van-grid clickable :column-num="2" :gutter="10">
      <van-grid-item icon="home-o" text="考勤管理" to="/checkWork" />
      <van-grid-item icon="search" text="班次管理" url="/classes" />
    </van-grid>
    <van-cell title="修改密码" is-link url="/updatePassword" />

    <van-button type="primary" @click="loginOut">退出登录</van-button>
  </div>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    methods:{
      loginOut(){
        this.$dialog.confirm({
          title: '提示',
          message: '确认退出吗？',
          theme: 'round-button',
        })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
          // on cancel
        });
      }
    }
  }
</script>

<style scoped lang="scss">
</style>

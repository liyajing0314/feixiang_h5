<template>
  <div class="container">
    <div class="head-box">
      <img src="@/assets/images/console/bac.png" class="bac-img"
      srcset='../../assets/images/console/bac.png 1x,
             ../../assets/images/console/bac@2x.png 2x'/>
      <div class="head-content">
        <p class="name">你好，张三丰</p>
        <p class="desc">欢迎使用新物业劳动力管理智能化云平台</p>
        <div class="grid">
          <div @click="$router.push('/checkWork')">
            <img src="@/assets/images/console/icon_kq.png" class="grid-icon"/>
            <span>考勤管理</span>
          </div>
          <div @click="$router.push('/classes')">
            <img src="@/assets/images/console/icon_bc.png" class="grid-icon"/>
            <span>班次管理</span>
          </div>
        </div>
      </div>
    </div>
    <van-cell title="修改密码" is-link url="/updatePassword" title-class="titleClass" :border="false">
      <template #icon>
        <img src="@/assets/images/console/icon_updatepassword.png" class="icon_updatepassword"
        srcset='../../assets/images/console/icon_updatepassword.png 1x,
               ../../assets/images/console/icon_updatepassword@2x.png 2x'/>
      </template>
    </van-cell>
    <span @click="loginOut" class="login-out">退出登录</span>
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
  .container {
    background: #ffffff;
    min-height: calc(100vh - 50px);
  }
  .head-box {
    width:100%;
    height:220px;
    position: relative;
    .head-content {
      position: absolute;
      top:0;
      left:0;
      z-index: 2;
      width: 100%;
      height:100%;
      padding: 12px;
    }
    .bac-img {
      position: absolute;
      width:100%;
      height:100%;
      top:0;
      left:0;
      z-index: 1;
    }
    .name {
      color: #000508;
      font-size: 20px;
      margin: 20px 0 8px;
    }
    .desc {
      color: #7a81a1;
      font-size: 12px;
      margin: 0 0 36px;
    }
  }
  .grid {
    display: flex;
    justify-content: space-between;
    >div {
      width: 170px;
      height: 80px;
      background-color: #ffffff;
      border: 1px solid rgba(37,116,240,0.10);
      border-radius: 12px;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      color: #333333;
      font-size: 16px;
      font-weight: 400;
    }
    .grid-icon {
      width:36px;
      height:36px;
      margin-right: 12px;
    }
  }
  .icon_updatepassword {
    width:24px;
    height:24px;
    margin-right: 16px;
  }
  .titleClass {
    font-size: 16px;
  }
  .login-out {
    position: absolute;
    bottom:95px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width:100px;
    text-align: center;
    color: #808896;
    font-size: 16px;
    cursor: pointer;
  }
</style>

<template>
  <div class="container">
    <img src="@/assets/images/login/logo.png" class="logo"/>
    <p class="title">
      新物业劳动力管理<br> 智能化云平台
    </p>
    <van-form @submit="onSubmit">
      <van-field v-model="username"  placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]" >
        <template #left-icon>
          <img src="@/assets/images/login/icon_phone.png" class="icon"/>
        </template>
      </van-field>
      <van-field v-model="password" type="password" placeholder="请输入密码"
        :rules="[{ required: true, message: '请输入密码' }]" >
        <template #left-icon>
          <img src="@/assets/images/login/icon_password.png" class="icon"/>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit" class="btn">登录</van-button>
      </div>
    </van-form>
    <img src="@/assets/images/login/bg.png" class="bg"/>
  </div>
</template>

<script>
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import {login} from '@/api/user'
  export default {
    data() {
      return {
        username: '',
        password: '',
      }
    },
    methods: {
      onSubmit(values) {
        let param = {
          username:this.username,
          password:this.password
        }
        login(param).then(res=>{
          if(res.code === 200){
            let tokenId = res.data.tokenId
            localStorage.setItem(ACCESS_TOKEN,tokenId)
            console.info('222')
            this.$store.dispatch('getProjectData')
            this.$router.push('/kanban')
          }else{
            this.$toast(res.msg || '登录失败')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height:100vh;
    background-color: #FFFFFF;
    padding: 36px 32px;
    .title {
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 1.6;
      margin-bottom: 48px;
    }
    .logo {
      width:86px;
      height:32px;
      margin-bottom: 32px;
    }
    .icon {
      width:16px;
      height:16px;
      vertical-align: middle;
      margin-right: 12px;
    }
    .bg {
      position: absolute;
      bottom:0;
      left: 0;
      width:100%;
      height:302px;
      z-index: -1;
    }
    .btn {
      background: #2574f0;
      border-radius: 6px;
      height: 48px;
      margin-top: 70px;
      font-size: 16px;
    }
  }
</style>

<template>
  <div class="container">
    <van-form @submit="onSubmit">
      <van-field v-model="username"  placeholder="请输入新密码"
        :rules="[{ required: true, message: '请输入新密码' }]" >
        <template #left-icon>
          <img src="@/assets/images/login/icon_password.png" class="icon"/>
        </template>
      </van-field>
      <van-field v-model="password" type="password" placeholder="请再次输入新密码"
        :rules="[{ required: true, message: '请输入密码' }]" >
        <template #left-icon>
          <img src="@/assets/images/login/icon_password2.png" class="icon"/>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit" class="btn">确认修改</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
      }
    },
    methods: {
      onSubmit(values) {
        console.log('submit', values);
        localStorage.setItem('token','123456')
        this.$router.push('/kanban')
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height:100vh;
    background-color: #FFFFFF;
    padding: 36px 24px;
    .title {
      font-size: 28px;
      font-weight: 600;
      color: #333333;
      line-height: 1.6;
      margin-bottom: 48px;
    }
    .icon {
      width:16px;
      height:16px;
      vertical-align: middle;
      margin-right: 12px;
    }
    .btn {
      background: #2574f0;
      border-radius: 6px;
      height: 48px;
      margin-top: 120px;
      font-size: 16px;
    }
  }
</style>

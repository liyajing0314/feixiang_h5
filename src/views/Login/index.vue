<template>
  <div>
    <p>登录</p>
    <van-form @submit="onSubmit">
      <van-field v-model="username" name="用户名" label="用户名" placeholder="请输入用户名"
        :rules="[{ required: true, message: '请输入用户名' }]" />
      <van-field v-model="password" type="password" name="密码" label="密码" placeholder="请输入密码"
        :rules="[{ required: true, message: '请输入密码' }]" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登录</van-button>
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

<style>
</style>

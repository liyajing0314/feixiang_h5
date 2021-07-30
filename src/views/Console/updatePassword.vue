<template>
  <div class="container">
    <van-form @submit="onSubmit">
      <van-field v-model="newPassword"  placeholder="请输入新密码" :error="false"
        :rules="[{ required: true, message: '请输入新密码' }]" >
        <template #left-icon>
          <!-- <img src="@/assets/images/login/icon_password.png" class="icon"/> -->
          <svg-icon icon-class="icon_password" class-name="icon"></svg-icon>
        </template>
      </van-field>
      <van-field v-model="confirmPassword" type="password" placeholder="请再次输入新密码" :error="false"
        :rules="[{ required: true, message: '请输入密码' },{validator, message: '两次密码请保持一致' }]" class="field-top">
        <template #left-icon>
          <!-- <img src="@/assets/images/login/icon_password2.png" class="icon"/> -->
          <svg-icon icon-class="icon_password2" class-name="icon"></svg-icon>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit" class="btn">确认修改</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import {debounce} from '@/utils/index'
  import {changePassword} from '@/api/user'
  export default {
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
      }
    },
    methods: {
       validator(val) {
        return this.newPassword == this.confirmPassword;
      },
      onSubmit:debounce(function(values) {
        let param = {
          newPassword:this.newPassword,
          confirmPassword:this.confirmPassword
        }
        changePassword(param).then(res=>{
          if(res.code === 200){
            this.newPassword = ''
            this.confirmPassword = ''
            this.$toast('修改成功')
            this.$router.push('/console')
          }else{
            this.$toast(res.msg || '修改失败')
          }
        })
      },500)
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
  .field-top {
    margin-top: 24px;
  }
  /deep/.van-form {
    position: relative;
    z-index: 2;
    .van-field__control {
      font-size: 16px;
    }
    .van-cell {
      background-color: transparent;
    }
  }
</style>

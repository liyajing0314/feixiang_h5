<template>
  <van-popup v-model="show" position="bottom" round>
      <div class="content">
        <p><span>迟到</span>修改为</p>
        <textarea class="textarea"></textarea>
      </div>
      <div class="bottom-oper">
        <van-button type="primary" class="btn btn-cancel" @click="cancel">取消</van-button>
        <van-button type="primary" class="btn btn-ok" @click="submit">确定</van-button>
      </div>
    </van-popup>
  </template>
</template>

<script>
  export default {
    data(){
      return {
        show:false,
      }
    },
    methods:{
      showPopup(){
        this.show = true
      },
      cancel(){
        this.show = false
      },
      submit(){
        this.cancel()
      }
    }
  }
</script>

<style scoped lang="scss">
  .content {
    padding-bottom: 88px;
  }
  .textarea {
    width:100%;
    height:100px;
    border:2px solid $theme-color;
  }
  .bottom-oper {
    position: fixed;
    bottom:0;
    left:0;
    width:100%;
    height:88px;
    background-color: rgba(255,255,255,0.9);
    padding: 6px 2px;
    box-sizing: border-box;
    .btn {
      width:160px;
      height:44px;
      font-size: 16px;
      margin:0 12px;
      border-radius: 6px;
      border:none;
    }
    .btn-cancel {
      background: #e9f1fd;
      color: $theme-color;
    }
    .btn-ok {
      background-color: $theme-color;
    }
  }
</style>

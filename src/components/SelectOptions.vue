<template>
  <van-action-sheet v-model="show" title="选择项目" :closeable="false">
    <div class="content">
      <div class="list-box">
        <div class="list" :class="{'active':active === index}" v-for="(item,index) in 50" :key="index" @click="toSel(index)">
          <span>好设计让好产品可用好设计让好产品可用</span>
        </div>
      </div>
      <div class="bottom-oper">
        <van-button type="primary" class="btn btn-cancel" @click="cancel">取消</van-button>
        <van-button type="primary" class="btn btn-ok" @click="submit">确定</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
  export default {
    data(){
      return {
        show:false,
        active:-1
      }
    },
    methods:{
      showAction(){
        this.show = true
      },
      toSel(index){
        this.active = index
      },
      cancel(){
        this.active = -1
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
    padding: 16px 16px 88px;
    .list-box {
      max-height: 300px;
      overflow: auto;
    }
    .list {
      height:52px;
      line-height: 52px;
      font-size: 14px;
      font-weight: 400;
      border-bottom: 1px solid #eaedf1;
      position: relative;
      padding-right: 16px;
      @include textoverflow(1);
      &.active {
        color:$theme-color;
        &:before {
          content:'';
          height:14px;
          width:14px;
          position: absolute;
          right:0;
          top:50%;
          transform: translateY(-50%);
          background: url('~@/assets/images/icon_tick.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
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
  }
  /deep/.van-action-sheet__close {
    display: none;
  }
</style>

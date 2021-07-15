<template>
  <van-popup v-model="show" position="bottom" round>
    <p>选择月份</p>
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      title="选择年月"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
    />
    <div class="bottom-oper">
      <van-button type="primary" class="btn btn-cancel" @click="cancel">取消</van-button>
      <van-button type="primary" class="btn btn-ok" @click="submit">确定</van-button>
    </div>
  </van-popup>
</template>

<script>
  export default {
    data(){
      return {
        show:false,
        minDate: new Date(2020, 0, 1),
        maxDate: new Date(2025, 10, 1),
        currentDate: new Date(),
      }
    },
    methods:{
      showPopup(){
        this.show = true
      },
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`;
        }
        return val;
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

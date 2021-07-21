<template>
  <van-popup v-model="show" position="bottom" round>
    <p class="title">选择月份</p>
    <van-datetime-picker
      v-model="currentDate"
      type="year-month"
      :show-toolbar="false"
      :max-date="maxDate"
      :formatter="formatter"
    >
    </van-datetime-picker>
    <div class="bottom-oper">
      <van-button type="primary" class="btn btn-cancel" @click="cancel">取消</van-button>
      <van-button type="primary" class="btn btn-ok" @click="submit">确定</van-button>
    </div>
  </van-popup>
</template>

<script>
  import {toChineseNum} from '@/utils/index.js'
  export default {
    data(){
      return {
        show:false,
        minDate: new Date(2020, 0, 1),
        maxDate: new Date(),
        currentDate: new Date(),
      }
    },
    methods:{
      showPopup(){
        this.show = true
      },
      formatter(type, val) {
        if (type === 'year') {
          return `${val}`;
        } else if (type === 'month') {
          let data = val >= 10 ? val :(val.split('')[1])
          let num = toChineseNum(data)
          return `${num}月`;
        }
        return val;
      },
      cancel(){
        this.show = false
      },
      submit(val){
        const currentDate = this.currentDate
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        let date = year + '-' + ( month >=10 ? month : '0'+month)
        this.$emit('selPicker',date)
        this.cancel()
      }
    }
  }
</script>

<style scoped lang="scss">
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
  }
  .van-picker{
    margin-bottom:88px;
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
  }
</style>

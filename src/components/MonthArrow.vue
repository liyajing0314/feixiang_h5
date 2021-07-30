<template>
  <div class="month-arrow">
    <span @click="changMonth('minus')">
       <svg-icon icon-class="icon_left" class-name="icon-arrow"  ></svg-icon>
    </span>
    <span>{{chineseNum(month)}}</span>
    <span @click="changMonth('add')">
       <svg-icon icon-class="icon_right" class-name="icon-arrow"  ></svg-icon>
    </span>
  </div>
</template>

<script>
  import {toChineseNum,getLastMonth,getNextMonth} from '@/utils/index'
  export default {
    props:['month'],
    data(){
      return {
      }
    },
    methods:{
      changMonth(type){
        let month = ''
        if(type === 'minus'){ //上一个月
          month = getLastMonth(this.month)
        }else{
          month = getNextMonth(this.month)
        }
        this.$emit('changeMonth',month)
      },
      chineseNum(val){
        if(!val){
          return ''
        }
        let date = val.split('-')
        let year = date[0]
        let month = date[1]
        let data = month >= 10 ? month :(month.length > 1 ? month.split('')[1] : month)
        return year + '年'+toChineseNum(data)+'月'
      },
    }
  }
</script>

<style scoped lang="scss">
.month-arrow {
  @include flexbox();
  // margin-bottom: 18px;
  padding:18px 12px;
  font-size: 16px;
  font-weight: 600;
  .icon-arrow {
    width:24px;
    height:24px;
  }
}
</style>

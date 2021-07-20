<template>
  <div>
    <van-calendar
      title="5月"
      type ="single"
      :poppable="false"
      :show-confirm="false"
      :show-mark="false"
      :show-subtitle="false"
      :show-title="false"
      :min-date="minDate"
      :max-date="maxDate"
      :row-height="50"
      :color="color"
      :style="{ height: '500px' }"
      :formatter="formatter"
      @select="select"
    />
  </div>
</template>

<script>
  export default {
    data(){
      return {
        color:'#1989fa',
        minDate: new Date(2010, 0, 1),
        maxDate: new Date(2010, 0, 31),
      }
    },
    mounted() {

    },
    methods:{
      select(value){
        console.info('value',value)
      },
      formatter(day) {
        const month = day.date.getMonth() + 1;
        const date = day.date.getDate();
        day.bottomInfo = '正常';

        return day;
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/.van-calendar__header {
    box-shadow: none;
  }
  /deep/.van-calendar__day {
    margin: 3px;
    width: calc(14.285% - 6px);
    background-color: rgba(101,200,184,0.1);
    border-radius: 6px;
  }
</style>

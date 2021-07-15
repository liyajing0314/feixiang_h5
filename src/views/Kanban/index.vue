<template>
  <div class="container">
    <div class="project"><span>万达影城</span>
    <van-button type="primary" size="mini" @click="switchItems">切换</van-button>
    <van-button type="primary" size="mini" @click="switchTime">时间</van-button>
    </div>
    <div class="profile">
      <div v-for="(item,index) in profileData" :key="index" class="profile-item">
        <p>{{item.label}}</p>
        <p>{{item.count}}</p>
      </div>
    </div>
    <jrgk></jrgk>
    <lskq></lskq>
    <fjsj></fjsj>
    <rwwcqk></rwwcqk>
    <fwzlzs></fwzlzs>
    <select-options ref="SelectOptions"></select-options>
    <sel-picker ref="SelPicker"></sel-picker>
  </div>
</template>

<script>
  import SelPicker from '@/components/SelPicker'
  import SelectOptions from '@/components/SelectOptions'
  import fwzlzs from './components/fwzlzs'
  import rwwcqk from './components/rwwcqk'
  import fjsj from './components/fjsj'
  import lskq from './components/lskq'
  import jrgk from './components/jrkq'
  export default {
    components:{jrgk,lskq,fjsj,rwwcqk,fwzlzs,SelectOptions,SelPicker},
    data(){
      return {
        profileData:[ //概况数据
          {
            label:'房间数',
            count:8959
          },
          {
            label:'工牌数',
            count:8959
          },
          {
            label:'信标数',
            count:8959
          },
          {
            label:'劳动者数',
            count:8959
          },
          {
            label:'昨日出勤人数',
            count:8959
          },
          {
            label:'昨日累计工时',
            count:8959
          },
          {
            label:'本月异常考勤',
            count:8959
          }
        ],
      }
    },
    methods:{
      switchItems(){
        console.info(this.$refs)
        this.$refs.SelectOptions.showAction()
        // this.$router.push('/switchItems')
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding: 20px;
  }
  .project {
    margin-bottom: 20px;
  }
  .profile {
    display: -webkit-box;
    overflow-x: scroll;
    -webkit-overflow-scrolling:touch;
    margin-bottom: 10px;
    .profile-item {
      width:100px;
      background-color: #FFFFFF;
      padding: 10px;
      &:not(:last-of-type) {
        margin-right:10px;
      }
    }
  }
</style>

<template>
  <div class="container">
    <div class="project">
      <span>{{project.name}}</span>
      <img src="@/assets/images/icon_change.png"
        srcset='../../assets/images/icon_change.png 1x,
                 ../../assets/images/icon_change@2x.png 2x' class="icon-change" @click="switchItems"/>
    </div>
    <div class="profile">
      <div class="profile-item">
        <div>
          <p class="nums">{{profileData.roomNum}}</p>
          <p class="desc">房间数</p>
        </div>
        <div class="icon-boxs boxs1">
          <img src="@/assets/images/kanban/icon_room.png"
          srcset='../../assets/images/kanban/icon_room.png 1x,
                 ../../assets/images/kanban/icon_room@2x.png 2x'/>
        </div>
      </div>
      <div class="profile-item">
        <div>
          <p class="nums">{{profileData.cardNum}}</p>
          <p class="desc">工牌数</p>
        </div>
        <div class="icon-boxs boxs2">
          <img src="@/assets/images/kanban/icon_card.png"
          srcset='../../assets/images/kanban/icon_card.png 1x,
                 ../../assets/images/kanban/icon_card@2x.png 2x'/>
        </div>
      </div>
      <div class="profile-item">
        <div>
          <p class="nums">{{profileData.beaconNum}}</p>
          <p class="desc">信标数</p>
        </div>
        <div class="icon-boxs boxs3">
          <img src="@/assets/images/kanban/icon_beacon.png"
          srcset='../../assets/images/kanban/icon_beacon.png 1x,
                 ../../assets/images/kanban/icon_beacon@2x.png 2x'/>
        </div>
      </div>
      <div class="profile-item">
        <div>
          <p class="nums">{{profileData.empNum}}</p>
          <p class="desc">劳动者总数</p>
        </div>
        <div class="icon-boxs boxs4">
          <img src="@/assets/images/kanban/icon_laborer.png"
          srcset='../../assets/images/kanban/icon_laborer.png 1x,
                 ../../assets/images/kanban/icon_laborer@2x.png 2x'/>
        </div>
      </div>
      <div class="profile-list">
        <div>
          <p class="nums">{{profileData.TodayPersonNum}}</p>
          <p class="desc">昨日出勤人数</p>
        </div>
        <div>
          <p class="nums">{{profileData.TodayWorkTime}}</p>
          <p class="desc">昨日累计工时</p>
        </div>
        <div>
          <p class="nums">{{profileData.errorkaoqin}}</p>
          <p class="desc">本月异常考勤</p>
        </div>
      </div>
    </div>
    <jrkq></jrkq>
    <!-- <lskq></lskq> -->
    <fjsj></fjsj>
    <rwwcqk></rwwcqk>
    <fwzlzs></fwzlzs>
    <select-options ref="SelectOptions" @selProject="selProject"></select-options>
  </div>
</template>

<script>
  import {toThousands} from '@/utils/index'
  import {projectDataCount} from '@/api/kanban'
  import SelectOptions from '@/components/SelectOptions'
  import fwzlzs from './components/fwzlzs'
  import rwwcqk from './components/rwwcqk'
  import fjsj from './components/fjsj'
  import lskq from './components/lskq'
  import jrkq from './components/jrkq'
  export default {
    components:{jrkq,lskq,fjsj,rwwcqk,fwzlzs,SelectOptions},
    data(){
      return {
        profileData:{},
      }
    },
    computed: {
      ...mapGetters([
        'getProjectData',
      ]),
      project:{
        get(){
          return this.$store.getters.getSelProject
        },
        set(data){
          this.$store.commit('SET_SEL_PROJECT',data)
        }
      }
    },
    mounted() {

    },
    methods:{
      projectDataCount(){
        projectDataCount({id:this.project.id}).then(res=>{
          if(res.code === 200){
            let data = res.data
            let newData = {}
            for(let key in data) {
              newData[key] = toThousands(data[key])
            }
            this.profileData = newData
          }else{
            this.profileData = {}
          }
        })
      },
      switchItems(){
        this.$refs.SelectOptions.showAction()
      },
      selProject(val){
        this.project = val
        this.projectDataCount()
      },
      switchTime(){
        this.$refs.SelPicker.showPopup()
      },
      kaoqin(){
        this.$refs.TimePopup.showPopup()
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding: 12px;
    background-color: #F7F7F8;
  }
  .project {
    margin-bottom: 16px;
    color:#000508;
    font-weight: 600;
    font-size: 20px;
    display: flex;
    align-items: center;
    >span {
      @include textoverflow()
    }
    .icon-change {
      width:16px;
      height:16px;
      margin-left: 4px;
    }
  }
  .profile {
    // display: -webkit-box;
    // overflow-x: scroll;
    // -webkit-overflow-scrolling:touch;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .profile-item {
      width:171px;
      height:66px;
      background-color: #FFFFFF;
      padding:9px 12px;
      border-radius: 6px;
      box-sizing: border-box;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .icon-boxs {
      width:42px;
      height:42px;
      text-align: center;
      border-radius: 50%;
      >img {
        width:24px;
        height:24px;
        margin-top: 9px;
      }
    }
    .boxs1 {
      background: rgba(47,196,255,0.10);
    }
    .boxs2 {
      background: rgba(240,159,37,0.10);
    }
    .boxs3 {
      background: rgba(76,240,37,0.10);
    }
    .boxs4 {
      background: rgba(37,52,240,0.10);
    }
    .nums {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 2px;
    }
    .desc {
      color: #808896;
      font-size: 12px;
      font-weight: 400;
      margin: 0;
    }
    .profile-list {
      background-color: #ffffff;
      border-radius: 4px;
      padding:12px;
      display: flex;
      justify-content: center;
      align-items: center;
      width:100%;
      height:72px;
      text-align: center;
      >div {
        margin: 0 16px;
      }
    }
  }
</style>

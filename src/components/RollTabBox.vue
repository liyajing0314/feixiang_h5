<template>
  <div>
    <div class="tab-content">
      <div class="tab-box" ref="tabBox">
        <span :ref="'tab'+index" class="tab" :class="{'active':tabActive.id === item.id}" v-for="(item,index) in tabList" :key="item.id" @click="changeTab(item)">{{item.name}}</span>
      </div>
      <div class="items" @click="showPopup">
        <svg-icon icon-class="icon_search" class-name="icon-search"></svg-icon>
      </div>
    </div>
    <select-people-single ref="selectPeople" :list="tabList" @selPeople="selPeople"></select-people-single>
  </div>
</template>

<script>
  import SelectPeopleSingle from '@/components/SelectPeopleSingle'
  export default {
    props:['tabList'],
    components:{SelectPeopleSingle},
    data(){
      return {
        tabActive:{}
      }
    },
    watch:{
      tabList:{
        handler (newName, oldName) {
          this.tabActive = this.tabList[0]
        },
        immediate: true,
        deep: true
      }
    },
    methods:{
      changeTab(item){
        this.tabActive = item
        this.$emit('changeRollTab',item)
      },
      showPopup(){
        this.$refs.selectPeople.showPopup('global')
      },
      selPeople(item,index){
        this.changeTab(item)
        let clientWidth = this.$refs['tab'+index][0].clientWidth
        let left = (clientWidth + 10) * index
        this.$refs.tabBox.scrollTo({
          left: left,
          behavior: "smooth" // 平滑滚动
        })
      }
    }
  }
</script>

<style scoped lang="scss">
.tab-content {
  display: flex;
  background: #ffffff;
  padding-top: 12px;
  padding-right: 16px;
  .tab-box {
    display: -webkit-box;
    overflow-x: scroll;
    white-space:nowrap;
    -webkit-overflow-scrolling:touch;
    flex:2;
    font-size: 14px;
    font-weight: 400;
    color: #808896;
    border-bottom: 1px solid #eaedf1;
    &::-webkit-scrollbar {
      width:0;
      height:0;
      display: none;
    }
    .tab {
      display: inline-block;
      margin:0 6px;
      padding: 7px 0 7px;
      border-bottom: 2px solid rgba(37,116,240,0);
      &.active {
        color: #333333;
        border-bottom: 2px solid rgba(37,116,240,1);
        font-weight: 600;
      }
    }
  }
  .items {
    width:32px;
    height:36px;
    background-color: #ffffff;
    border-left: 1px solid #eaedf1;
    border-bottom: 1px solid #eaedf1;
  }
  .icon-search {
    width: 16px;
    height:16px;
    margin:8px 0 0 14px;
  }
}
</style>

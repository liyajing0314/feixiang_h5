<!-- 选择人员 -->
<template>
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%' }">
    <div class="container">
      <p class="title">选择人员</p>
      <div class="search-container">
        <!-- <img src="@/assets/images/icon_search.png" class="icon-search"/> -->
        <svg-icon icon-class="icon_input_search" class-name="icon-search"></svg-icon>
        <input type="text" v-model="searchValue" placeholder="搜索劳动者" class="search-input" @keyup.enter="onSearch" @input="changeWord"/>
        <span @click="onSearch" class="search">搜索</span>
      </div>
      <span class="record" v-show="searchFlag && searchValue">共<span class="num">{{result.length}}</span>条搜索记录</span>
      <div ref="content" class="content">
        <div :ref="'items'+index" class="items" :class="{'active':activeItem.id === item.id}"
          v-for="(item,index) in dataList" :key="item.id" @click="selItem(item,index)" v-if="type === 'global'">
          <span v-html="item.name"></span>
        </div>
        <div :ref="'items'+index" class="items" :class="{'active':activeItem === item}"
          v-for="(item,index) in dataList" :key="item" @click="selItem(item,index)" v-if="type === 'task'">
          <span v-html="item"></span>
        </div>
      </div>

    </div>
  </van-popup>
</template>

<script>
  export default {
    props:['list'],
    data() {
      return {
        show: false,
        searchValue: '',
        activeItem:'',
        result:[],
        searchFlag:false,
        dataList:[],
        type:'' , //global 全局  task 仅应用于task模块
      }
    },
    mounted() {

    },
    methods: {
      showPopup(type=global) {
        this.type = type
        this.searchValue = ''
        this.result = []
        this.searchFlag = false
        this.activeItem = ''
        this.dataList = JSON.parse(JSON.stringify(this.list))
        this.show = true
      },
      changeWord(){
        this.searchFlag = false
      },
      onSearch() {
        this.searchFlag = true
        let searchValue = this.searchValue
        let result = []
        let patt1 = new RegExp(searchValue);
        let list = JSON.parse(JSON.stringify(this.list))
        let index = ''

        if(this.type === 'global'){
          index = list.findIndex(item=>{
            return item.name.indexOf(searchValue) >-1
          })
          this.dataList = list.map(item=>{
            if(item.name.indexOf(searchValue) >-1){
              result.push(item)
              item.name = item.name.replace(patt1,`<span style='color: #ff6326;'>${searchValue}</span>`)
            }
            return item
          })
        }else if(this.type === 'task'){
          index = list.findIndex(item=>{
            return item.indexOf(searchValue) >-1
          })
          this.dataList = list.map(item=>{
            if(item.indexOf(searchValue) >-1){
              result.push(item)
              item = item.replace(patt1,`<span style='color: #ff6326;'>${searchValue}</span>`)
            }
            return item
          })
        }
        this.result = result
        if(index > -1){
          let items = this.$refs['items' + index][0]
          let top = items.offsetTop
          this.$refs.content.scrollTo({
            top: top ,
            behavior: "smooth" // 平滑滚动
          })
        }

      },
      selItem(item,index){ //选择人员

        let patt1 = new RegExp("<span style='color: #ff6326;'>");
        let patt2 = new RegExp("</span>");
        if(this.type === 'global'){
          item.name = item.name.replace(patt1,``)
          item.name = item.name.replace(patt2,``)
        }else{
          item = item.replace(patt1,``)
          item = item.replace(patt2,``)
        }

        this.activeItem = item
        this.$emit('selPeople',item,index)
        this.show = false
      },
    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding:16px;
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 16px;
    }
  }
  .search-container {
    width:100%;
    height: 36px;
    background: #eaedf1;
    border-radius: 6px;
    padding: 6px 12px 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    vertical-align: middle;
    margin-bottom: 24px;
    .icon-search {
      width:16px;
      height: 16px;
    }
    .search-input {
      border:none;
      margin: 0 4px;
      flex: 2;
      font-size: 14px;
      background-color: transparent;
      &::-webkit-input-placeholder{
        color: #bfc5ce;
      }
    }

    .search {
      font-weight: 400;
      color: #2574f0;
      font-size: 14px;
      text-align: right;
    }
  }
  .content {
    max-height: calc(100vh - 170px);
    margin:8px 0 0 ;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .items {
      height: 32px;
      width: 130px;
      text-align: center;
      background: #f7f7f8;
      border-radius: 6px;
      color: #333333;
      font-size: 14px;
      padding: 6px 12px;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
      position: relative;
      >span {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width:calc(100% - 12px - 10px);
        display: inline-block;
      }
      &.active {
        color: #2574f0;
        background: rgba(37,116,240,0.10);
      }
      .icon-tick {
        height: 12px;
        margin-top: 4px;
      }
    }
    /deep/.van-checkbox {
      // width:100%;
    }
    /deep/.van-checkbox__icon {
      // width:100%;
      height:auto;
    }
    /deep/.van-checkbox-group {
      @include flexbox();
      flex-wrap: wrap;
    }
  }

  .record {
    color: #808896;
    font-size: 12px;
    font-weight: 400;
    .num {
      color:rgba(255,99,38,1);
    }
  }
  .sel-active {
    color:rgba(255,99,38,1);
  }
  .bottom {
    background-color: rgba(255,255,255,0.8);
    height:88px;
    padding:6px 12px;
    bottom: 0;
    right: 0;
    position: absolute;
    width: 100%;
    .btn {
      width:130px;
      height:44px;
      font-size: 16px;
      margin:0 4px;
      border-radius: 6px;
      border:none;
    }
  }
</style>

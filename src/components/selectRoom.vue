<!-- 选择房间 -->
<template>
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%' }">
    <div class="container">
      <p class="title">选择房间</p>
      <div class="search-container">
        <!-- <img src="@/assets/images/icon_search.png" class="icon-search"/> -->
        <svg-icon icon-class="icon_input_search" class-name="icon-search"></svg-icon>

        <input type="text" v-model="searchValue" placeholder="搜索房间名" class="search-input" @keyup.enter="onSearch" @input="changeWord"/>
        <span @click="onSearch" class="search">搜索</span>
      </div>
      <span class="record" v-show="searchFlag && searchValue">共<span class="num">{{searchResult.length}}</span>条搜索记录</span>
      <div ref="content" class="content">
        <van-checkbox-group v-model="result">
            <van-checkbox :name="item"  v-for="(item,index) in dataList" >
              <template #icon="props">
                <div class="items" :class="{'active':props.checked}" :ref="'items'+index">
                  <span v-html="item.roomName"></span>
                <img src="@/assets/images/icon_tick.png" class="icon-tick" v-show="props.checked" />
                </div>
              </template>
            </van-checkbox>
            <van-empty description="此项目暂无房间工时数据" v-if="!dataList.length"/>
        </van-checkbox-group>
      </div>

      <div class="bottom">
        <van-button type="primary" class="btn btn-cancel" @click="clear">清空</van-button>
        <van-button type="primary" class="btn btn-ok" @click="confirm">确定({{result.length}})</van-button>
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
        result: [],
        searchResult:[],
        dataList:[],
        searchValue: '',
        searchFlag:false,
      }
    },
    mounted() {

    },
    methods: {
      showPopup(){
        this.searchValue = ''
        this.result = []
        this.searchFlag = false
        this.searchResult = []
        this.dataList = JSON.parse(JSON.stringify(this.list))
        this.show = true
      },
      changeWord(){
        this.searchFlag = false
      },
      onSearch() {
        this.searchFlag = true
        let searchValue = this.searchValue
        let searchResult = []
        let patt1 = new RegExp(searchValue);
        let list = JSON.parse(JSON.stringify(this.list))
        let index = -1
        index = list.findIndex(item=>{
          return item.roomName.indexOf(searchValue) >-1
        })
        this.dataList = list.map(item=>{
          if(item.roomName.indexOf(searchValue) >-1){
            searchResult.push(item)
            item.roomName = item.roomName.replace(patt1,`<span style='color: #ff6326;'>${searchValue}</span>`)
          }
          return item
        })

        this.searchResult = searchResult
        let items = this.$refs['items' + index][0]
        let top = items.offsetTop - 140

        this.$refs.content.scrollTo({
          top: top ,
          behavior: "smooth" // 平滑滚动
        })

      },
      confirm() {
        if (this.result.length === 0) {
          this.$toast('请选择房间');
        }else if(this.result.length >15){
          this.$toast('最多可选15个房间');
        }else {
          let result = JSON.parse(JSON.stringify(this.result))
          result.map(item=>{
            let patt1 = new RegExp("<span style='color: #ff6326;'>");
            let patt2 = new RegExp("</span>");
            item.roomName = item.roomName.replace(patt1,``)
            item.roomName = item.roomName.replace(patt2,``)
            return item
          })

          this.$emit('selRoomData',result)
          this.show = false
        }
      },
      clear(){ //清空
        this.searchValue = ''
        this.result = []
        this.searchFlag = false
        this.searchResult = []
        this.dataList = JSON.parse(JSON.stringify(this.list))
      }
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
    height: calc(100vh - 170px);
    margin:8px 0 0 ;
    overflow: auto;
    padding-bottom: 80px;
    .items {
      height: 32px;
      background: #f7f7f8;
      border-radius: 6px;
      color: #333333;
      font-size: 14px;
      padding: 6px 12px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
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
      width:100%;
    }
    /deep/.van-checkbox__icon {
      width:100%;
      height:auto;
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
  /deep/.van-empty__description {
    padding:0 20px;
  }
</style>

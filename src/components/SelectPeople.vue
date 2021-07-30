<!-- 选择人员 -->
<template>
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%' }">
    <div class="container">
      <p class="title">选择人员</p>
      <div class="search-container">
        <!-- <img src="@/assets/images/icon_search.png" class="icon-search"/> -->
        <svg-icon icon-class="icon_input_search" class-name="icon-search"></svg-icon>
        <input type="text" v-model="value" placeholder="搜索劳动者" class="search-input" @keyup="onSearch"/>
        <span @click="onSearch" class="search">搜索</span>
      </div>
      <span class="record">共<span class="num">5</span>条搜索记录</span>
      <div ref="content" class="content">
        <van-checkbox-group v-model="result">

            <van-checkbox :name="item" ref="checkboxes" v-for="(item,index) in 50" >
              <template #icon="props">
                <div class="items" :class="{'active':props.checked}">
                  <span>人员{{index}}</span>
                </div>
              </template>
            </van-checkbox>

        </van-checkbox-group>
      </div>

      <div class="bottom">
        <van-button type="primary" class="btn btn-cancel">清空</van-button>
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
        indexList: [],
        value: '',
        result: []
      }
    },
    mounted() {
      let num = 50
      for (let i = 1; i <= num; i++) {
        this.indexList.push(i)
      }
    },
    methods: {
      showPopup() {
        this.show = true
      },
      onSearch() {
        let index = 11

        this.$refs.content.scrollTo({
          top: this.$refs['anchor' + index].offsetTop - 60,
          behavior: "smooth" // 平滑滚动
        })
      },
      confirm() {
        if (this.result.length === 0) {
          this.$toast('请选择人员');
        } else {
          this.show = false
        }

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
    padding-bottom: 80px;
    overflow: auto;
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

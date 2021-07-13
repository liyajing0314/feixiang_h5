<!-- 选择人员 -->
<template>
  <van-popup v-model="show" position="right" :style="{ height: '100%',width:'80%' }">
    <van-search v-model="value" placeholder="请输入搜索关键词" />
    <div>
      <van-checkbox-group v-model="result">
        <van-index-bar :index-list="indexList" :sticky="false">
          <van-checkbox :name="index+1"  v-for="(item,index) in 50">
            <van-index-anchor  :index="index+1" >标题{{index+1}}</van-index-anchor>
          </van-checkbox>
        </van-index-bar>
      </van-checkbox-group>
    </div>

    <div class="bottom">
      <van-button type="primary">清空</van-button>
      <van-button type="info">确定</van-button>
    </div>
  </van-popup>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
        indexList:[],
        value:'',
        result:[]
      }
    },
    mounted() {
      let num = 50
      for(let i = 1;i<=num;i++){
        this.indexList.push(i)
      }
    },
    methods:{
      showPopup(){
        this.show = true
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/.bottom {
    position: fixed;
    background-color: #ffffff;
    padding: 10px;
    bottom:0;
    right:0;
  }
</style>

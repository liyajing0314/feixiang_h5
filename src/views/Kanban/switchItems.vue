<!-- 切换项目 -->
<template>
  <div>
    <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
    <div class="bottom">
      <van-button type="primary">确认切换</van-button>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
      }
    },
    methods: {
      onLoad() {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            this.list.push(this.list.length + 1);
          }

          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 1000);
      },
      onClickLeft() {
        Toast('返回');
      },
    }
  }
</script>

<style scoped lang="scss">
  .bottom {
    position: fixed;
    bottom:0;
    width:100%;
    background-color: #FFFFFF;
    padding: 10px;
  }
</style>

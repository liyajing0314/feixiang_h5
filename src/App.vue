<template>
  <div id="app">
    <router-view v-if="isShow"/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data(){
    return {
      isShow: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  mounted() {
    // if (window.performance.navigation.type === 1) {
    //   console.log("页面被刷新")
    //   window.isReload = 'isReload'

    // }else{
    //   location.reload()
    // }
  },
  computed:{
    key(){
      return this.$route.name ?this.$route.name + + new Date():this.$route+ + new Date()
    }
  },
  methods: {
    reload () {
      this.isShow= false
      this.$nextTick(function () {
        this.isShow= true
      })
    }
  }
}
</script>
<style lang="scss"></style>

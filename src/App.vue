<template>
  <div id="app">
    <router-view :key="key"/>
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    console.info(this.$route)

    if (window.performance.navigation.type == 1) {
      console.log("页面被刷新")
    }else{
      console.log("首次被加载")
      let path = this.$route.path
      console.log("首次被加载",path)
      if(path != '/' || path !='/login'){
        console.info('重新加载')
        // this.$store.dispatch('getProjectData')
        location.reload()
      }
    }
  },
  computed:{
    key(){
      return this.$route.name ?this.$route.name + + new Date():this.$route+ + new Date()
    }
  }
}
</script>
<style lang="scss"></style>

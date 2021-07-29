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
    // this.$store.dispatch('getProjectData')
  },
  computed:{
    key(){
      return this.$route.name ?this.$route.name + + new Date():this.$route+ + new Date()
    }
  }
}
</script>
<style lang="scss"></style>

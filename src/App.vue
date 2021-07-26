<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    console.info(this.$route)
    // this.$store.dispatch('getProjectData')
  }
}
</script>
<style lang="scss"></style>

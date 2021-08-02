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
    if (window.performance.navigation.type === 1) {
      window.isReload = 'isReload'
    }else{ //页面首次进入
      location.reload()
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

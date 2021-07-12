<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
    <div class="layout-footer">
      <TabBar :data="tabbars" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'AppLayout',
  data() {
    return {
      tabbars: [
        {
          title: '看板',
          to: {
            name: 'Kanban'
          },
          icon: 'user-o'
        },
        {
          title: '定位',
          to: {
            name: 'Location'
          },
          icon: 'user-o'
        },
        {
          title: '任务',
          to: {
            name: 'Task'
          },
          icon: 'user-o'
        },
        {
          title: '控制台',
          to: {
            name: 'Console'
          },
          icon: 'user-o'
        }
      ]
    }
  },
  components: {
    TabBar
  },
  methods: {
    handleChange(v) {
      console.log('tab value:', v)
    }
  }
}
</script>

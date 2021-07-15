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
          icon: {
            active:require('@/assets/images/tabBar/kanban.png'),
            inactive:require('@/assets/images/tabBar/kanban_normal.png'),
          }
        },
        {
          title: '定位',
          to: {
            name: 'Location'
          },
          icon: {
            active:require('@/assets/images/tabBar/location.png'),
            inactive:require('@/assets/images/tabBar/location_normal.png'),
          }
        },
        {
          title: '任务',
          to: {
            name: 'Task'
          },
          icon: {
            active:require('@/assets/images/tabBar/task.png'),
            inactive:require('@/assets/images/tabBar/task_normal.png'),
          }
        },
        {
          title: '控制台',
          to: {
            name: 'Console'
          },
          icon: {
            active:require('@/assets/images/tabBar/console.png'),
            inactive:require('@/assets/images/tabBar/console_normal.png'),
          }
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

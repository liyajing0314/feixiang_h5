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
            active:"tab_kanban_active",
            inactive:"tab_kanban",
          }
        },
        {
          title: '定位',
          to: {
            name: 'Location'
          },
          icon: {
            active:"tab_location_active",
            inactive:"tab_location",
          }
        },
        {
          title: '任务',
          to: {
            name: 'Task'
          },
          icon: {
            active:"tab_task_active",
            inactive:"tab_task",
          }
        },
        {
          title: '控制台',
          to: {
            name: 'Console'
          },
          icon: {
            active:"tab_console_active",
            inactive:"tab_console",
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

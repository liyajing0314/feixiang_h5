/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/kanban',
    meta: {
      title: '看板',
      keepAlive: false
    },
    children: [
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我', keepAlive: false }
      },
      {
        path: '/kanban',
        name: 'Kanban',
        component: () => import('@/views/Kanban/index'),
        meta: { title: '看板', keepAlive: false }
      },
      {
        path: '/location',
        name: 'Location',
        component: () => import('@/views/Location/index'),
        meta: { title: '实时位置', keepAlive: false }
      },
      {
        path: '/task',
        name: 'Task',
        component: () => import('@/views/Task/index'),
        meta: { title: '任务', keepAlive: false }
      },
      {
        path: '/console',
        name: 'Console',
        component: () => import('@/views/Console/index'),
        meta: { title: '我的', keepAlive: false }
      }
    ]
  },
  {
    path: '/switchItems',
    name: 'SwitchItems',
    component: () => import('@/views/Kanban/switchItems'),
    meta: { title: '切换项目', keepAlive: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index'),
    meta: { title: '登录', keepAlive: false }
  }
]

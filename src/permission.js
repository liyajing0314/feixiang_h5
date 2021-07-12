import Vue from 'vue'
import router from './router'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  let ACCESS_TOKEN = localStorage.getItem('token')
  if (ACCESS_TOKEN) {
    if (to.path === '/login') {
      next({ path: '/kanban' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
})

// router.afterEach(() => {
//   NProgress.done() // finish progress bar
// })

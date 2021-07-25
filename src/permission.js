import Vue from 'vue'
import router from './router'
import {ACCESS_TOKEN} from '@/store/mutation-types'
const whiteList = ['/login','/viewReport']

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  let token = localStorage.getItem(ACCESS_TOKEN)
  if (token) {
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

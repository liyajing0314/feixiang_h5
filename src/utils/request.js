import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
import {ACCESS_TOKEN} from '@/store/mutation-types'
import router from '../router'
import { Dialog } from 'vant';
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    let token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    console.info('res',res)
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch('Logout').then(() => {
          location.reload()
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    const {response} = error;
    console.info('错误===》',response)
    console.log('err' + error) // for debug
    // 403 token过期
    // 清除token并跳转登录页
    if(response.status === 403){
      localStorage.removeItem(ACCESS_TOKEN);
      Dialog.alert({
        message: '登录过期，请重新登录',
      }).then(() => {
        location.reload()
      });
    }

    return Promise.reject(error)
  }
)

export default service

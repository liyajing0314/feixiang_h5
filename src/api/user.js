import request from '@/utils/request'

// 登录
export function login(params) {
  return request({
    url: '/authManage/login',
    method: 'get',
    params
  })
}

// 用户信息 post 方法
// export function getUserInfo(data) {
//   return request({
//     url: api.UserInfo,
//     method: 'post',
//     data,
//     hideloading: true
//   })
// }

// // 用户名称 get 方法
// export function getUserName(params) {
//   return request({
//     url: api.UserName,
//     method: 'get',
//     params,
//     hideloading: true
//   })
// }

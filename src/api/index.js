import request from '@/utils/request'

export function loadproject(data) {
  return request({
    url: '/project/loadproject',
    method: 'post',
    data
  })
}

export function location_now_v2(data) {
  return request({
    url: '/actual/location_now_v2',
    method: 'post',
    data
  })
}

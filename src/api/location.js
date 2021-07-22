import request from '@/utils/request'

/**
 * 实时定位
 * @param {Object} params
 */
export function location_now_fx(params) {
  return request({
    url: '/workData/actual/location_now_fx',
    method: 'get',
    params
  })
}

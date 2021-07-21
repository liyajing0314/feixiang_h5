import request from '@/utils/request'

/**
 * 各房间工时
 * @param {Object} params
 */
export function selectRoomhourList(params) {
  return request({
    url: '/workData/room/selectRoomhourList',
    method: 'get',
    params
  })
}

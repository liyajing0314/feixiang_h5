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

/**
 * 考勤报表
 * @param {Object} params
 */
export function attendanceReport(params) {
  return request({
    url: '/attendanceManage/schedulerecord/attendanceReport',
    method: 'get',
    params
  })
}
/**
 * 查询项目统计数据
 * @param {Object} params
 */
export function projectDataCount(params) {
  return request({
    url: '/projectManage/project/projectDataCount',
    method: 'get',
    params
  })
}




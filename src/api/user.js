import request from '@/utils/request'

// 登录
export function login(params) {
  return request({
    url: '/authManage/login',
    method: 'get',
    params
  })
}
/**
 * 退出登录
 * @param {Object} params
 */
export function logout(params) {
  return request({
    url: '/authManage/logout',
    method: 'get',
    params
  })
}
/**
 * 考勤上下班时间
 * @param {Object} params
 */
export function getOnOffDuty(params) {
  return request({
    url: '/attendanceManage/schedulerecord/getOnOffDuty',
    method: 'get',
    params
  })
}
/**
 * 查看某人某月考勤/班次
 * @param {Object} params
 */
export function getMonthSchedulerecordInfo(params) {
  return request({
    url: '/attendanceManage/schedulerecord/getMonthSchedulerecordInfo',
    method: 'get',
    params
  })
}

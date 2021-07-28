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
/**
 * 获根据项目ID和人员 ID 取班次-人员记录详细信息
 * @param {Object} params
 */
export function getAll(params) {
  return request({
    url: '/attendanceManage/employee/getAll',
    method: 'get',
    params
  })
}
/**
 *  修改某日班次
 * @param {Object} params
 */
export function updateDaySchedulerecord(params) {
  return request({
    url: '/attendanceManage/schedulerecord/updateDaySchedulerecord',
    method: 'post',
    params
  })
}
/**
 * 修改考勤状态
 * @param {Object} params
 */
export function updateSchedulerecordStatus(params) {
  return request({
    url: '/attendanceManage/schedulerecord/updateSchedulerecordStatus',
    method: 'post',
    data:params
  })
}
/**
 * 获取考勤记录明细
 * @param {Object} params
 */
export function getRecord(params) {
  return request({
    url: `/attendanceManage/schedulerecord/${params}`,
    method: 'get',
  })
}

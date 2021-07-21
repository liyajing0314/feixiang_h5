import request from '@/utils/request'

/**
 * 房间列表
 * @param {Object} params
 */
export function roomList(params) {
  return request({
    url: '/workData/room/list',
    method: 'get',
    params
  })
}
/**
 * 人员列表
 * @param {Object} params
 */
export function employeeList(params) {
  return request({
    url: '/authManage/employee/list',
    method: 'get',
    params
  })
}
/**
 * 分组列表
 * @param {Object} params
 */
export function groupList(params) {
  return request({
    url: '/projectManage/group/list',
    method: 'get',
    params
  })
}
/**
 * 查询项目列表
 * @param {Object} params
 */
export function projectList(params) {
  return request({
    url: '/projectManage/project/list',
    method: 'get',
    params
  })
}

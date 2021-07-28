import request from '@/utils/request'

/**
 * 昨日任务人数
 * @param {Object} params
 * projectid 项目ID
 */
export function getYesterdayTaskUserNum(params) {
  return request({
    url: '/taskManage/taskRecord/getYesterdayTaskUserNum',
    method: 'get',
    params
  })
}
/**
 * 昨日完成人数和未完成人数
 * @param {Object} params
 * projectid 项目ID
 */
export function getYesterdayTaskInfo(params) {
  return request({
    url: '/taskManage/taskRecord/getYesterdayTaskInfo',
    method: 'get',
    params
  })
}
/**
 * 查询任务计划列表
 * @param {Object} params
 * projectid 项目ID
 * pageNum 	第几页
 * pageSize 每页长度
 */
export function taskList(params) {
  return request({
    url: '/taskManage/taskPlan/list',
    method: 'get',
    params
  })
}
/**
 * 查询任务详情
 * @param {Object} params
 */
export function taskPlanDetail(params) {
  return request({
    url:`/taskManage/taskPlan/${params}`,
    method: 'get',
  })
}
/**
 * 按任务查看某月任务完成情况
 * @param {Object} params
 */
export function getMonthProjectTaskInfoByTask(params) {
  return request({
    url:`/taskManage/taskPlan/getMonthProjectTaskInfoByTask`,
    method: 'get',
    params
  })
}
/**
 * 按条件查看某月任务完成情况
 * @param {Object} params
 */
export function getMonthProjectTaskInfo(params) {
  return request({
    url:`/taskManage/taskPlan/getMonthProjectTaskInfo`,
    method: 'get',
    params
  })
}
/**
 * 获取异常列表
 * @param {Object} params
 */
export function getErrorTaskInfo(params) {
  return request({
    url:`/taskManage/taskPlan/getErrorTaskInfo`,
    method: 'get',
    params
  })
}

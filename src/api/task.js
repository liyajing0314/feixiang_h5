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
  console.info('params',params)
  return request({
    url:`/taskManage/taskPlan/${params}`,
    method: 'get',
  })
}

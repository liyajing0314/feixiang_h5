import {PLAN_DATA,LOCATION_DATA,ACCESS_TOKEN,PROJECT_DATA,SEL_PROJECT,USER_INFO} from '@/store/mutation-types'
import {logout} from '@/api/user'
import {projectList} from '@/api/common'
const state = {
  userInfo:{}, //用户信息
  userName: '',
  planData:{},
  locationData:{}, //选中的定位数据
  projectData:[], //项目列表
  selProject:{},//选中的项目
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_USER_INFO(state,data){
    localStorage.setItem(USER_INFO,JSON.stringify(data))
    state.userInfo = data
  },
  SET_PLAN_DATA(state,data){
    localStorage.setItem(PLAN_DATA,JSON.stringify(data))
    state.planData = data
  },
  SET_LOCATION_DATA(state,data){
    localStorage.setItem(LOCATION_DATA,JSON.stringify(data))
    state.locationData = data
  },
  SET_PROJECT_DATA(state,data){
    localStorage.setItem(PROJECT_DATA,JSON.stringify(data))
    state.projectData = data
  },
  SET_SEL_PROJECT(state,data){
    localStorage.setItem(SEL_PROJECT,JSON.stringify(data))
    state.selProject = data
  }
}
const actions = {
  // 设置name
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  },
  //登出
  Logout({ commit, state }){
    return new Promise((resolve) => {
      localStorage.remove(ACCESS_TOKEN)
      logout().then(() => {
        resolve()
      }).catch(() => {
        resolve()
      })
    })
  },
  //获取项目列表
  getProjectData({commit,state}){
    return new Promise((resolve,reject)=>{
      projectList().then(res=>{
        let list= res.rows
        commit('SET_PROJECT_DATA',list)
        let selProject = state.selProject
        console.info('selProject',selProject,JSON.stringify(selProject))
        if(!selProject || JSON.stringify(selProject) === '{}'){
          commit('SET_SEL_PROJECT',list[0])
        }
        resolve()
      }).catch(error=>{
        reject()
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}

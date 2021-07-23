import {PLAN_DATA,LOCATION_DATA,ACCESS_TOKEN} from '@/store/mutation-types'
import {logout} from '@/api/user'
const state = {
  userName: '',
  planData:{},
  locationData:{}
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_PLAN_DATA(state,data){
    localStorage.setItem(PLAN_DATA,JSON.stringify(data))
    state.planData = data
  },
  SET_LOCATION_DATA(state,data){
    localStorage.setItem(LOCATION_DATA,JSON.stringify(data))
    state.locationData = data
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
  }
}
export default {
  state,
  mutations,
  actions
}

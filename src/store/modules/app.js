import {PLAN_DATA,LOCATION_DATA} from '@/store/mutation-types'
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
  }
}
export default {
  state,
  mutations,
  actions
}

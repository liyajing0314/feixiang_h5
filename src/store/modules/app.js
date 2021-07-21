const state = {
  userName: '',
  planData:{},

}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_PLAN_DATA(state,data){
    localStorage.setItem('PLANDATA',JSON.stringify(data))
    state.planData = data
  }
}
const actions = {
  // 设置name
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  },
  setPlanData({commit},data){
    commit('SET_PLAN_DATA',data)
  }
}
export default {
  state,
  mutations,
  actions
}

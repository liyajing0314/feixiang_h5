const getters = {
  userName: state => state.app.userName,
  planData:state =>  {state.app.planData = localStorage.getItem('PLANDATA'); return JSON.parse(state.app.planData)}
}
export default getters

import {PLAN_DATA,LOCATION_DATA} from '@/store/mutation-types'
const getters = {
  userName: state => state.app.userName,
  planData:state =>  {state.app.planData = localStorage.getItem(PLAN_DATA); return JSON.parse(state.app.planData)},
  locationData:state =>  {state.app.locationData = localStorage.getItem(LOCATION_DATA); return JSON.parse(state.app.locationData)}
}
export default getters

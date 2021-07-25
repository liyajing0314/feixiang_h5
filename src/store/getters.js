import {PLAN_DATA,LOCATION_DATA,PROJECT_DATA,SEL_PROJECT} from '@/store/mutation-types'
const getters = {
  userName: state => state.app.userName,
  planData:state =>  {state.app.planData = localStorage.getItem(PLAN_DATA); return JSON.parse(state.app.planData)},
  locationData:state =>  {state.app.locationData = localStorage.getItem(LOCATION_DATA); return JSON.parse(state.app.locationData)},
  getProjectData:state =>{state.app.projectData = localStorage.getItem(PROJECT_DATA); return JSON.parse(state.app.projectData)},
  getSelProject:state =>{state.app.selProject = localStorage.getItem(SEL_PROJECT); return JSON.parse(state.app.selProject)},
}
export default getters

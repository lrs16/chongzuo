import router from 'umi/router';
import {
  maintenanceList
} from '../services/quality';

export default {
  namespace:'qualityassessment',

  state:{
    maintenanceData:[]
  },

  effects: {
    *maintenanceList({ payload }, { call,put }) {
      const response = yield call(maintenanceList,payload);
      console.log('response: ', response);
      yield put ({
        type:'maintenanceData',
        payload: response
      })
    },

     // 流转
  *gotoNextprocess({ payload }, { call, put }) {
    const response = yield call(maintenanceList,payload)
    router.push({
      pathname:'/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform'
    })
  },
  },

 

  reducers: {
    maintenanceData(state,action) {
      return {
        ...state,
        maintenanceData: action.payload
      }
    }
  }
}
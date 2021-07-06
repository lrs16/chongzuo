import router from 'umi/router';
import {
  maintenanceList,
  tobeDealtdata
} from '../services/serviceperformanceappraisalapi';

export default {
  namespace:'performanceappraisal',

  state:{
    maintenanceData:[],
    tobeDealtarr:[]
  },

  effects: {
    *maintenanceList({ payload }, { call,put }) {
      const response = yield call(maintenanceList,payload);
      yield put ({
        type:'maintenanceData',
        payload: response
      })
    },

    //  服务绩效考核待办列表
    *tobeDealtdata({ payload }, { call,put }) {
      const response = yield call(tobeDealtdata,payload);
      yield put ({
        type:'tobeDealtarr',
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
    },

    tobeDealtarr(state,action) {
      return {
        ...state,
        tobeDealtarr: action.payload
      }
    },
  }
}
import {
  maintenanceList,
  eventServiceList
} from '../services/statistics';

export default {
  namespace: 'eventstatistics',

  state: {
    maintenanceArr:[],
    eventServicearr:[],
  },

  effects: {
    // 运维分类情况统计列表
    *fetchMaintenancelist({ payload }, { call, put }) {
      const response = yield call(maintenanceList,payload);
      yield put ({
        type: 'maintenanceArr',
        payload: response
      })
    },

    // 运维服务指标统计列表
    *fetcheventServiceList({ payload }, { call, put }) {
      const response = yield call(eventServiceList,payload);
      yield put ({
        type: 'eventServicearr',
        payload: response
      })
    },


    
  },

  reducers: {
  // 运维分类情况统计列表
  maintenanceArr(state, action) {
    return {
      ...state,
      maintenanceArr: action.payload.data
    }
  },

  // 维服务指标统计列表
  eventServicearr(state, action) {
    return {
      ...state,
      maintenanceArr: action.payload.data
    }
  },

  },
};
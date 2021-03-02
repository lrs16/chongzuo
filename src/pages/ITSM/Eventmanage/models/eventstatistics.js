import {
  maintenanceList
} from '../services/statistics';

export default {
  namespace: 'eventstatistics',

  state: {
    maintenanceArr:[],
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
    
  },

  reducers: {
  // 问题状态列表
  maintenanceArr(state, action) {
    return {
      ...state,
      maintenanceArr: action.payload.data
    }
  },

  },
};
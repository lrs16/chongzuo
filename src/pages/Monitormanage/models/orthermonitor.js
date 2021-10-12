import { getAppMonitorData } from '../services/api';

export default {
  namespace: 'orthermonitor',

  state: {
    chartdata: [],
  },

  effects: {
    // 获取图表列表
    *fetchchart({ payload }, { call, put }) {
      const response = yield call(getAppMonitorData, payload);
      yield put({
        type: 'savechart',
        payload: response.data,
      });
    },
  },

  reducers: {
    savechart(state, action) {
      return {
        ...state,
        chartdata: action.payload,
      };
    },
  },
};

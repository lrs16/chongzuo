import { getAppMonitorData, getBarChart } from '../services/api';

export default {
  namespace: 'orthermonitor',

  state: {
    chartdata: [],
    messagechart: {},
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
    *fetchmessagechart({ payload }, { call, put }) {
      const response = yield call(getBarChart, payload);
      yield put({
        type: 'savemessage',
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
    savemessage(state, action) {
      return {
        ...state,
        messagechart: action.payload,
      };
    },
  },
};

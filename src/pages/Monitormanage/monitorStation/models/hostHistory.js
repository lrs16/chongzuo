import { queryHistory, quesrySystemInfo } from '../services/history';

export default {
  namespace: 'hostHistory',

  state: {
    host: {},
    systemInfo: {},
  },

  reducers: {
    listHost(state, { payload }) {
      return { ...state, host: payload };
    },
    setSystemInfo(state, { payload: data }) {
      return {
        ...state,
        systemInfo: data,
      };
    },
  },

  effects: {
    *listHistory({ payload }, { call, put }) {
      const response = yield call(queryHistory, payload);
      yield put({
        type: 'listHost',
        payload: response.data,
      });
    },

    *fetchSystemInfo({ payload: { hostId } }, { call, put }) {
      const response = yield call(quesrySystemInfo, hostId);
      yield put({
        type: 'setSystemInfo',
        payload: response.data,
      });
    },
  },
};

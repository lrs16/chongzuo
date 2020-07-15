import { queryHistory } from '../services/history';

export default {
  namespace: 'hostHistory',

  state: {
    host: {},
  },

  reducers: {
    listHost(state, { payload }) {
      return { ...state, host: payload };
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
  },
};

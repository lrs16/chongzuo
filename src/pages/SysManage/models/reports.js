import { queryDatas } from '../services/api';

export default {
  namespace: 'managereport',

  state: {
    departments: [],
  },

  effects: {
    *fetchdatas({ payload }, { call, put }) {
      const response = yield call(queryDatas, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

import { querDictTree } from '@/services/api';

export default {
  namespace: 'dicttree',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querDictTree, payload);
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

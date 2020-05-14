import { queryAuthorityList } from '../services/api';

export default {
  namespace: 'autmanage',

  state: {
    TreeDatas: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAuthorityList, payload);
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

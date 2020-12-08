import { queryEventList, queryIframtest } from '../services/api';

export default {
  namespace: 'eventtodo',

  state: {
    list: [],
    html: '',
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryEventList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

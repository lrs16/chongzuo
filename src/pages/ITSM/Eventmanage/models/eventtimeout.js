import { querytimeout, timeoutdownload } from '../services/api';

export default {
  namespace: 'eventtimeout',

  state: {
    list: [],
  },

  effects: {
    // 列表
    *query({ payload }, { call, put }) {
      const response = yield call(querytimeout, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 下载
    *download({ payload }, { call }) {
      return yield call(timeoutdownload, payload);
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

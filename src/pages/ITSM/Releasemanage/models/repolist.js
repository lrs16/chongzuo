import { message } from 'antd';
import { repoList } from '../services/api';

export default {
  namespace: 'repolist',

  state: {
    list: [],
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(repoList, payload);
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
        list: action.payload || [],
      };
    },
  },
};

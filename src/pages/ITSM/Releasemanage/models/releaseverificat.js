import { queryTodoList } from '../services/api';

export default {
  namespace: 'releaseverificat',

  state: {
    list: [],
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryTodoList, payload);
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

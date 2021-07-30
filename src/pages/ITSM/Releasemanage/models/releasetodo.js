import { queryTodoList, openFlow } from '../services/api';

export default {
  namespace: 'releasetodo',

  state: {
    list: {},
    info: {},
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
    // 打开待办
    *openflow({ payload: { releaseNo } }, { call, put }) {
      const response = yield call(openFlow, releaseNo);
      yield put({
        type: 'saveinfo',
        payload: response.data,
      });
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload || {},
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload || {},
      };
    },
  },
};

import {
  AgentList, updataAgent
} from '../services/api';

export default {
  namespace: 'agentmanage',

  state: {
    list: {}
  },

  effects: {
    // 获取agent列表
    *query({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(AgentList, values, pageNum, pageSize);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },

    *update({ payload }, { call }) {
      return yield call(updataAgent, payload);
    },
  },

  reducers: {
    savelist(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

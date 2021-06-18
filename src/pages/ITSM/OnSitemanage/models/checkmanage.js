import { queryCheckList, querydoCheck, querywholeNet, goonwholeNet } from '../services/api';

export default {
  namespace: 'checkmanage',

  state: {
    list: [],
  },

  effects: {
    // 列表
    *fetchlist({ payload: { currentPage, pageSize } }, { call, put }) {
      const response = yield call(queryCheckList, currentPage, pageSize);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *docheck(_, { call }) {
      return yield call(querydoCheck);
    },
    *dowholeNet(_, { call }) {
      return yield call(querywholeNet);
    },
    *goonwholeNet({ payload }, { call }) {
      return yield call(goonwholeNet, payload);
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

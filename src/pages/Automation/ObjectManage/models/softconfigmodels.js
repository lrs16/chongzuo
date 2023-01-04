import {
  softConfList,
  softConfHistoryList, // 历史版本列表
} from '../services/api';

export default {
  namespace: 'softconf',

  state: {
    softconflist: {}, // 软件配置list
    softconfhistorylist: {}, // 历史版本list
  },

  effects: {
    // 获取软件配置列表
    *findsoftConfList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(softConfList, values, pageNum, pageSize);
      yield put({
        type: 'getsoftlist',
        payload: response.data,
      });
    },

    // 获取历史版本列表
    *findsoftConfHistoryList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(softConfHistoryList, values, pageNum, pageSize);
      yield put({
        type: 'getsofthistorylist',
        payload: response.data,
      });
    },
  },

  reducers: {
    getsoftlist(state, action) {
      return {
        ...state,
        softconflist: action.payload,
      };
    },

    getsofthistorylist(state, action) {
      return {
        ...state,
        softconfhistorylist: action.payload,
      };
    }
  },
};

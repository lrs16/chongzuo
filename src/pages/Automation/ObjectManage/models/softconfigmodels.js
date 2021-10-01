import {
  softConfList,
} from '../services/api';

export default {
  namespace: 'softconf',

  state: {
    softconflist: {},
  },

  effects: {
    // 获取软件列表
    *findsoftConfList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(softConfList, values, pageNum, pageSize);
      yield put({
        type: 'getsoftlist',
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
  },
};

import { queryKpizbhbList, queryextractData, Downloadfils } from '../services/api';

export default {
  namespace: 'indicatorchain',

  state: {
    data: [],
  },

  effects: {
    // 获取列表
    *fetchzbhblist({ payload }, { call, put }) {
      const response = yield call(queryKpizbhbList, payload);
      yield put({
        type: 'getdatas',
        payload: response.data,
      });
    },

    // 抽数
    *fetchextractData({ payload }, { call }) {
      return yield call(queryextractData, payload);
    },

    // 下载
    *downloads({ payload }, { call }) {
      return yield call(Downloadfils, payload);
    },
  },

  reducers: {
    getdatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

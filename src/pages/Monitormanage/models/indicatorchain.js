import { queryKpizbhbList, queryextractData } from '../services/api';

export default {
  namespace: 'indicatorchain',

  state: {
    data: [],
  },

  effects: {
    *fetchzbhblist({ payload }, { call, put }) {
      const response = yield call(queryKpizbhbList, payload);
      yield put({
        type: 'getdatas',
        payload: response.data,
      });
    },
    *fetchextractData({ payload }, { call }) {
      return yield call(queryextractData, payload);
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

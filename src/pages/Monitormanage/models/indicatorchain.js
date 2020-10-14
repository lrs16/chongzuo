import { queryKpicblList, queryKpifglList, queryKpiwzlList } from '../services/api';

export default {
  namespace: 'indicatorchain',

  state: {
    data: [],
  },

  effects: {
    *fetchcbllist({ payload }, { call, put }) {
      const response = yield call(queryKpicblList, payload);
      yield put({
        type: 'getdatas',
        payload: response.data,
      });
    },
    *fetchfgllist({ payload }, { call, put }) {
      const response = yield call(queryKpifglList, payload);
      yield put({
        type: 'getdatas',
        payload: response.data,
      });
    },
    *fetchwzllist({ payload }, { call, put }) {
      const response = yield call(queryKpiwzlList, payload);
      yield put({
        type: 'getdatas',
        payload: response.data,
      });
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

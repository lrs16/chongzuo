import { getOnlineState, getZC } from '../services/api';

export default {
  namespace: 'sysrunning',

  state: {
    onlinestate: '',
    ZCdist: '',
    ZCdown: '',
  },

  effects: {
    *fetchOnlinestate(_, { call, put }) {
      const response = yield call(getOnlineState);
      yield put({
        type: 'getonline',
        payload: response.data,
      });
    },
    *fetchZCdist({ payload: { type } }, { call, put }) {
      const response = yield call(getZC, type);
      yield put({
        type: 'getZCdist',
        payload: response.data,
      });
    },
    *fetchZCdown({ payload: { type } }, { call, put }) {
      const response = yield call(getZC, type);
      yield put({
        type: 'getZCdown',
        payload: response.data,
      });
    },
  },

  reducers: {
    getonline(state, action) {
      return {
        ...state,
        onlinestate: action.payload,
      };
    },
    getZCdist(state, action) {
      return {
        ...state,
        ZCdist: action.payload,
      };
    },
    getZCdown(state, action) {
      return {
        ...state,
        ZCdown: action.payload,
      };
    },
  },
};

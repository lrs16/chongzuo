import { getOnlineState, getZC } from '../services/api';

export default {
  namespace: 'sysrunning',

  state: {
    onlinestate: '',
    ZCdist: '',
    ZCcontrol: '',
    ZCdown: '',
  },

  effects: {
    *fetchOnlinestate(_, { call, put }) {
      yield put({
        type: 'clearcache'
      });
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
    *fetchZCcontrol({ payload: { type } }, { call, put }) {
      const response = yield call(getZC, type);
      yield put({
        type: 'getZCcontrol',
        payload: response.data,
      });
    },
    // 后端反馈取不到
    *fetchZCdown({ payload: { type } }, { call, put }) {
      const response = yield call(getZC, type);
      yield put({
        type: 'getZCdown',
        payload: response.data,
      });
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        onlinestate: '',
        ZCdist: '',
        ZCcontrol: '',
        ZCdown: '',
      };
    },
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
    getZCcontrol(state, action) {
      return {
        ...state,
        ZCcontrol: action.payload,
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

import { queryDetail, queryDetailBasic, queryOperats } from '../services/api';

export default {
  namespace: 'alarmdetails',

  state: {
    list: [],
    operatslist: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchbasic({ payload }, { call, put }) {
      const response = yield call(queryDetailBasic, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *fetchoperats({ payload }, { call, put }) {
      const response = yield call(queryOperats, payload);
      yield put({
        type: 'getoperats',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getoperats(state, action) {
      return {
        ...state,
        operatslist: action.payload,
      };
    },
  },
};

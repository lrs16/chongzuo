import {
  historyList,
  historyBasic,
  historyOpera,
  alarmHistory,
  alarmNotification,
} from '../services/api';

export default {
  namespace: 'historicalalarm',

  state: {
    list: [],
    basicInfo: [],
    opera: [],
    historyInfo: [],
    notificationInfo: [],
  },

  effects: {
    *fetchhistorylist({ payload }, { call, put }) {
      const response = yield call(historyList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *historyBasic({ payload }, { call, put }) {
      const response = yield call(historyBasic, payload);
      yield put({
        type: 'basic',
        payload: response,
      });
    },

    *historyOpera({ payload }, { call, put }) {
      const response = yield call(historyOpera, payload);
      yield put({
        type: 'opera',
        payload: response,
      });
    },

    *alarmHistory({ payload }, { call, put }) {
      const response = yield call(alarmHistory, payload);
      yield put({
        type: 'history',
        payload: response,
      });
    },

    *alarmNotification({ payload }, { call, put }) {
      const response = yield call(alarmNotification, payload);
      yield put({
        type: 'notification',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

    basic(state, action) {
      return {
        ...state,
        basicInfo: action.payload,
      };
    },

    opera(state, action) {
      return {
        ...state,
        opera: action.payload,
      };
    },

    history(state, action) {
      return {
        ...state,
        historyInfo: action.payload,
      };
    },

    notification(state, action) {
      return {
        ...state,
        notificationInfo: action.payload,
      };
    },
  },
};

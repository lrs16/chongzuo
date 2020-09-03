import {
  currentList,
  currentBasic,
  currentOpera,
  currentHistory,
  alarmNotification,
  confirmWarning,
  cancelConfirmation,
  currentalarmClose,
} from '../services/api';

export default {
  namespace: 'currentalarm',

  state: {
    list: [],
    basicInfo: [],
    opera: [],
    currentInfo: [],
    notificationInfo: [],
  },

  effects: {
    *currentList({ payload }, { call, put }) {
      const response = yield call(currentList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *currentBasic({ payload }, { call, put }) {
      const response = yield call(currentBasic, payload);
      yield put({
        type: 'basic',
        payload: response,
      });
    },

    *currentOpera({ payload }, { call, put }) {
      const response = yield call(currentOpera, payload);
      yield put({
        type: 'opera',
        payload: response,
      });
    },

    *currentHistory({ payload }, { call, put }) {
      const response = yield call(currentHistory, payload);
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

    *confirmWarning({ payload }, { call }) {
      return yield call(confirmWarning, payload);
    },

    *cancelConfirmation({ payload }, { call }) {
      return yield call(cancelConfirmation, payload);
    },

    *currentalarmClose({ payload }, { call }) {
      return yield call(currentalarmClose, payload);
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
        currentInfo: action.payload,
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

import { queryAlarmList, configAlarmList, AlarmoverDonut, AlarmoverSmooth } from '../services/api';

export default {
  namespace: 'measuralarm',

  state: {
    list: [],
    Donutdata: [],
    Smoothdata: [],
  },

  effects: {
    // 告警概览：列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryAlarmList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 告警概览：饼图
    *fetchoverdonut({ payload: { key } }, { call, put }) {
      const response = yield call(AlarmoverDonut, key);
      yield put({
        type: 'savedonut',
        payload: response.data,
      });
    },
    // 告警概览：曲线
    *fetchoversmooth({ payload: { key } }, { call, put }) {
      const response = yield call(AlarmoverSmooth, key);
      yield put({
        type: 'savesmooth',
        payload: response.data,
      });
    },
    // 告警概览：确认告警
    *alarmsconfig({ payload: { selectedRowKeys } }, { call, put }) {
      const response = yield call(configAlarmList, selectedRowKeys);
      yield put({
        type: 'save',
        payload: response.data,
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
    savedonut(state, action) {
      return {
        ...state,
        Donutdata: action.payload,
      };
    },
    savesmooth(state, action) {
      return {
        ...state,
        Smoothdata: action.payload,
      };
    },
  },
};

import { queryAlarmList, configAlarmList, AlarmoverDonut, AlarmoverSmooth } from '../services/api';

export default {
  namespace: 'alarmovervies',

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
    *fetchoverdonut({ payload }, { call, put }) {
      const response = yield call(AlarmoverDonut, payload);
      yield put({
        type: 'savedonut',
        payload: response.data,
      });
    },
    // 告警概览：曲线
    *fetchoversmooth({ payload }, { call, put }) {
      const response = yield call(AlarmoverSmooth, payload);
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
        Donutdata: action.payload.data,
      };
    },
    savesmooth(state, action) {
      return {
        ...state,
        Smoothdata: action.payload.data,
      };
    },
  },
};

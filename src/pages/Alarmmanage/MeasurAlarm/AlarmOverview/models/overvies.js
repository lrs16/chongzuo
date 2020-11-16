import { queryAlarmList, configAlarmList } from '../services/api';

export default {
  namespace: 'alarmovervies',

  state: {
    list: [],
  },

  effects: {
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryAlarmList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
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
  },
};

import { queryAlarmList } from '../services/api';

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
  },
};

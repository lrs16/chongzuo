import { queryAlarmSetting } from '../services/api';

export default {
  namespace: 'measuralarmsetting',

  state: {
    list: [],
  },

  effects: {
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryAlarmSetting, payload);
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

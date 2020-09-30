import { strategyAdd } from '../services/alarmStrategy';

export default {
  namespace: 'strategyadd',

  state: {
    list: [],
  },

  effects: {
    *strategyAdd({ payload }, { call, put }) {
      debugger;
      const response = yield call(strategyAdd, payload);
      yield put({
        type: 'show',
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
  },
};

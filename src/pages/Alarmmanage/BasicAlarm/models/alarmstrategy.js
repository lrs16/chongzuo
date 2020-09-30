import { strategyList, strategyEnable, strategyOut } from '../services/alarmStrategy';

export default {
  namespace: 'alarmstrategy',

  state: {
    list: [],
  },

  effects: {
    *strategyList({ payload }, { call, put }) {
      const response = yield call(strategyList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *strategyEnable({ payload }, { call, put }) {
      console.log(payload);
      return yield call(strategyEnable, payload);
    },

    *strategyOut({ payload }, { call }) {
      return yield call(strategyOut, payload);
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

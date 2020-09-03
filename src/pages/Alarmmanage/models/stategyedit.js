import { strategyDetail, strategyTableone, strategyTabletwo } from '../services/alarmStrategy';
export default {
  namespace: 'strategyedit',

  state: {
    list: [],
    tableone: [],
    tabletwo: [],
  },

  effects: {
    *strategyDetail({ payload }, { call, put }) {
      const response = yield call(strategyDetail, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *strategyTableone({ payload }, { call, put }) {
      const response = yield call(strategyTableone, payload);
      yield put({
        type: 'tableone',
        payload: response,
      });
    },

    *strategyTabletwo({ payload }, { call, put }) {
      const response = yield call(strategyTabletwo, payload);
      yield put({
        type: 'tabletwo',
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

    tableone(state, action) {
      return {
        ...state,
        tableone: action.payload,
      };
    },

    tabletwo(state, action) {
      return {
        ...state,
        tabletwo: action.payload,
      };
    },
  },
};

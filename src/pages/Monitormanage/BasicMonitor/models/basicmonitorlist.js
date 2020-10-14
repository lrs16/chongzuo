import { querylisthost, querylisDatabase, queryapplication } from '../services/api';

export default {
  namespace: 'basicmonitorlist',

  state: {
    hostlist: [],
    databaselist: [],
    radiogroups: [],
  },

  effects: {
    *fetchhost({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylisthost, current, pageSize);
      yield put({
        type: 'gethost',
        payload: response.data,
        // payload: response,
      });
    },
    *fetchdatabase({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylisDatabase, current, pageSize);
      yield put({
        type: 'getdatabase',
        payload: response.data,
      });
    },
    *fetchradiogroups({ payload: { id } }, { call, put }) {
      const response = yield call(queryapplication, id);
      yield put({
        type: 'saveradiogroups',
        payload: response.data,
      });
    },
  },

  reducers: {
    gethost(state, action) {
      return {
        ...state,
        hostlist: action.payload,
      };
    },
    getdatabase(state, action) {
      return {
        ...state,
        databaselist: action.payload,
      };
    },
    saveradiogroups(state, action) {
      return {
        ...state,
        radiogroups: action.payload,
      };
    },
  },
};

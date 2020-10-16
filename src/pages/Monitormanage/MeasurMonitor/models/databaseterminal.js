import { getOnlinerate, gethourly, getspecially, gethistory } from '../services/api';

export default {
  namespace: 'databaseterminal',

  state: {
    operatingmode: {},
    storagecheck: {},
    thehour: {},
    list: {},
  },

  effects: {
    *fetchoperat(_, { call, put }) {
      const response = yield call(getOnlinerate);
      yield put({
        type: 'getoperat',
        payload: response.data,
      });
    },
    *fetchstorge(_, { call, put }) {
      const response = yield call(gethourly);
      yield put({
        type: 'getstoragecheck',
        payload: response.data,
        // payload: response,
      });
    },
    *fetchthehour(_, { call, put }) {
      const response = yield call(getspecially);
      yield put({
        type: 'getthehour',
        payload: response.data,
        // payload: response,
      });
    },
    *fetchlist(payload, { call, put }) {
      const response = yield call(gethistory, payload);
      yield put({
        type: 'getlistdata',
        payload: response.data,
      });
    },
  },

  reducers: {
    getoperat(state, action) {
      return {
        ...state,
        operatingmode: action.payload,
      };
    },
    getstoragecheck(state, action) {
      return {
        ...state,
        storagecheck: action.payload,
      };
    },
    getthehour(state, action) {
      return {
        ...state,
        thehour: action.payload,
      };
    },
    getlistdata(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

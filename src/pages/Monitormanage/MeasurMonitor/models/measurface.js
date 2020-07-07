import {
  querySettlement,
  queryArchives,
  queryIssue,
  queryFiletest, // 后端未实现
  queryMaintable,
  queryOrder,
} from '../services/api';

export default {
  namespace: 'measurface',

  state: {
    settldata: {},
    archdata: {},
    issuedata: {},
    filetdata: {}, // 后端未实现
    tabledata: {},
    orderdata: {},
  },

  effects: {
    *fetchsettl(_, { call, put }) {
      const response = yield call(querySettlement);
      yield put({
        type: 'getsettl',
        payload: response.data,
      });
    },
    *fetcharch(_, { call, put }) {
      const response = yield call(queryArchives);
      yield put({
        type: 'getarch',
        payload: response.data,
      });
    },
    *fetchissue(_, { call, put }) {
      const response = yield call(queryIssue);
      yield put({
        type: 'getissue',
        payload: response.data,
      });
    },
    *fetchfile(_, { call, put }) {
      const response = yield call(queryFiletest);
      yield put({
        type: 'getfile',
        payload: response.data,
      });
    },
    *fetchtable(_, { call, put }) {
      const response = yield call(queryMaintable);
      yield put({
        type: 'gettable',
        payload: response.data,
      });
    },
    *fetchorder(_, { call, put }) {
      const response = yield call(queryOrder);
      yield put({
        type: 'getorder',
        payload: response.data,
      });
    },
  },

  reducers: {
    getsettl(state, action) {
      return {
        ...state,
        settldata: action.payload,
      };
    },
    getarch(state, action) {
      return {
        ...state,
        archdata: action.payload,
      };
    },
    getissue(state, action) {
      return {
        ...state,
        issuedata: action.payload,
      };
    },
    getfile(state, action) {
      return {
        ...state,
        filetdata: action.payload,
      };
    },
    gettable(state, action) {
      return {
        ...state,
        tabledata: action.payload,
      };
    },
    getorder(state, action) {
      return {
        ...state,
        orderdata: action.payload,
      };
    },
  },
};

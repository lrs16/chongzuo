import {
  queryCompleterate,
  queryCoverage,
  queryMeterread,
  queryZeroread,
  queryHourread,
  querySales,
  querySupply,
} from '../services/api';

export default {
  namespace: 'monitorconfiguration',

  state: {
    complete: {},
    coverage: {},
    meterread: {},
    zeroread: [],
    hourread: [],
    salesdata: [],
    supplydata: [],
  },

  effects: {
    *fetchcomplete({ payload: { area } }, { call, put }) {
      const response = yield call(queryCompleterate, area);
      yield put({
        type: 'getcomplete',
        payload: response.data,
      });
    },
    *fetchcoverage({ payload: { area } }, { call, put }) {
      const response = yield call(queryCoverage, area);
      yield put({
        type: 'getcoverage',
        payload: response.data,
      });
    },
    *fetchmeterread({ payload: { area } }, { call, put }) {
      const response = yield call(queryMeterread, area);
      yield put({
        type: 'getmeterread',
        payload: response.data,
      });
    },
    *fetchzeroread(_, { call, put }) {
      const response = yield call(queryZeroread);
      yield put({
        type: 'getzeroread',
        payload: response.data,
      });
    },
    *fetchhourread(_, { call, put }) {
      const response = yield call(queryHourread);
      yield put({
        type: 'gethourread',
        payload: response.data,
      });
    },
    *fetchsales({ payload: { sortarea } }, { call, put }) {
      const response = yield call(querySales, sortarea);
      yield put({
        type: 'getsales',
        payload: response.data,
      });
    },
    *fetchsupply({ payload: { sortarea } }, { call, put }) {
      const response = yield call(querySupply, sortarea);
      yield put({
        type: 'getsupply',
        payload: response.data,
      });
    },
  },

  reducers: {
    getcomplete(state, action) {
      return {
        ...state,
        complete: action.payload,
      };
    },
    getcoverage(state, action) {
      return {
        ...state,
        coverage: action.payload,
      };
    },
    getmeterread(state, action) {
      return {
        ...state,
        meterread: action.payload,
      };
    },
    getzeroread(state, action) {
      return {
        ...state,
        zeroread: action.payload,
      };
    },
    gethourread(state, action) {
      return {
        ...state,
        hourread: action.payload,
      };
    },
    getsales(state, action) {
      return {
        ...state,
        salesdata: action.payload,
      };
    },
    getsupply(state, action) {
      return {
        ...state,
        supplydata: action.payload,
      };
    },
  },
};

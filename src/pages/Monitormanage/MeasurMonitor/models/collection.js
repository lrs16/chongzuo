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
  namespace: 'collection',

  state: {
    complete: {},
    coverage: {},
    meterread: {},
    zeroread: [],
    hourread: [],
    salesdata: [],
    supplydata: [],
  },

  // Effect 被称为副作用，在我们的应用中，最常见的就是异步操作，Effects 的最终流向是通过 Reducers 改变 State。
  // 核心需要关注下 put, call, select。
  effects: {
    *fetchcomplete({ payload: { area } }, { call, put }) {
      yield put({
        type: 'clearcache'
      });
      // call 触发service里面的方法
      // call的第一个参数是你要调用的函数，第二个参数开始是你要传递的参数，可一 一传递。
      const response = yield call(queryCompleterate, area);
      yield put({
        type: 'getcomplete', // 跟 Reducers 关联
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

    // 售电量
    *fetchsales({ payload: { area } }, { call, put }) {
      const response = yield call(querySales, area);
      yield put({
        type: 'getsales',
        payload: response.data,
      });
    },

    // 供电量
    *fetchsupply({ payload: { area } }, { call, put }) {
      const response = yield call(querySupply, area);
      yield put({
        type: 'getsupply',
        payload: response.data,
      });
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        complete: {},
        coverage: {},
        meterread: {},
        zeroread: [],
        hourread: [],
        salesdata: [],
        supplydata: [],
      };
    },
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
    // 供电量
    getsupply(state, action) {
      return {
        ...state,
        supplydata: action.payload,
      };
    },
  },
};

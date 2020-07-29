import { queryJobs, queryWorks, DoJobs, queryBasicJobs } from '../services/api';

export default {
  namespace: 'jobsmanage',

  state: {
    list: [],
    worklist: [],
  },

  effects: {
    *fetchworks({ payload }, { call, put }) {
      const response = yield call(queryWorks, payload);
      console.log(response);
      yield put({
        type: 'getworkdata',
        payload: response,
      });
    },
    *fetchjobs({ payload }, { call, put }) {
      const response = yield call(queryJobs, payload);
      yield put({
        type: 'getjobdata',
        payload: response,
      });
    },
    *dojob({ payload }, { call }) {
      return yield call(DoJobs, payload);
      // console.log(payload);
    },
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryBasicJobs, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    getworkdata(state, action) {
      return {
        ...state,
        worklist: action.payload,
      };
    },
    getjobdata(state, action) {
      return {
        ...state,
        joblist: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

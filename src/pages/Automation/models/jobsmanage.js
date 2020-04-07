import { queryJobs, DoJobs, queryBasicJobs} from '../services/api';

export default {
  namespace: 'jobsmanage',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryJobs, payload);
      console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *dojob({ payload, }, { call}) {
      return yield call(DoJobs,payload);
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
    save(state, action) {
      return {
        ...state,
        list: action.payload,
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
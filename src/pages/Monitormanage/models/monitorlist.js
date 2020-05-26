import { querylisthost, querylistdatabase } from '../services/api';

export default {
  namespace: 'monitorlist',

  state: {
    // current:'',
    data: [],
    // pageSize:'',
    // total:'',
    databaselist: [],
  },

  effects: {
    *fetchhost({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylisthost, current, pageSize);
      // console.log(response.data);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *fetchdatabase({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylistdatabase, current, pageSize);
      // console.log(response.data);
      yield put({
        type: 'savedatabase',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, { payload: { data, total, current } }) {
      return {
        ...state,
        data,
        total,
        current,
      };
    },
    savedatabase(state, { payload: { data, total, current } }) {
      return {
        ...state,
        databaselist: data,
        total,
        current,
      };
    },
  },
};

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
      const response = yield call(querylisthost, current, pageSize);
      // console.log(response.data);
      yield put({
        type: 'save',
        payload: { databaselist: response.data },
      });
    },
  },

  reducers: {
    save(state, { payload: { data, databaselist, total, current } }) {
      return {
        ...state,
        data,
        databaselist,
        total,
        current,
      };
    },
  },
};

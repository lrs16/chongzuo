import { querylisthost } from '../services/api';

export default {
  namespace: 'hostmonitorlist',

  state: {
    // current:'',
    data: [],
    // pageSize:'',
    // total:'',
  },

  effects: {
    *fetch({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylisthost, current, pageSize);
      // console.log(response.data);
      yield put({
        type: 'save',
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
  },
};

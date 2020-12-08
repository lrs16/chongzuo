import {
  problemList
} from '../services/api';

export default {
  namespace: 'problemmanage',

  state: {
    list:[],
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(problemList);
      yield put({
        type: 'getlist',
        payload: response,
      });
    },

  },

  reducers: {
    getlist(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },
    
  },
};

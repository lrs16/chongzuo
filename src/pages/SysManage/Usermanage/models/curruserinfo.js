import { query as getCurrUserInfo } from '../services/user';

export default {
  namespace: 'curruserinfo',

  state: {
    currUserdata: {},
  },

  effects: {
    *fetchCurruser(_, { call, put }) {
      const response = yield call(getCurrUserInfo);
      yield put({
        type: 'saveCurrUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrUser(state, action) {
      return {
        ...state,
        data: action.payload || {},
      };
    },
  },
};

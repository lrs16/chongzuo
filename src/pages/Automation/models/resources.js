import { queryResources } from '../services/api';

export default {
  namespace: 'jobresources',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryResources, payload);
      yield put({
        type: 'save',
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
  },
};
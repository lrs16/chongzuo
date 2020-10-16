import {
  configurationList
} from '../services/monitor';

export default {
  namespace: 'monitorconfiguration',

  state: {
    list:[]
  },

  effects: {
    *fetch(_,{ call, put }) {
      const response = yield call(configurationList);
      yield put({
        type:'list',
        payload:response.data,
      })
    }
  },

  reducers: {
    getcomplete(state, action) {
      return {
        ...state,
        complete: action.payload,
      };
    },

    list(state,action) {
      return {
        ...state,
        list: action.payload
      }
    }
  },
};

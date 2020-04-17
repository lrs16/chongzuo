import { queryTreecompactdata, queryFacadata } from '../services/api';

export default {
  namespace: 'measur',

  state: {
    treedatas: '',
    facadatas: '',
  },

  effects: {
    *fetchTreecompactdata({ payload }, { call, put }) {
      const response = yield call(queryTreecompactdata, payload);
      yield put({
        type: 'gettreedata',
        payload: response,
      });
    },
    *fetchFacatdata({ payload }, { call, put }) {
      const response = yield call(queryFacadata, payload);
      console.log(response);
      yield put({
        type: 'getfacadata',
        payload: response,
      });
    },
  },

  reducers: {
    gettreedata(state, action) {
      return {
        ...state,
        treedatas: action.payload,
      };
    },
    getfacadata(state, action) {
      return {
        ...state,
        facadatas: action.payload,
      };
    },
  },
};

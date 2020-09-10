import { querySoftExetute } from '../services/api';
import mockjs from 'mockjs';

const jxreq = {
  des: '456456456456456123123123',
};
export default {
  namespace: 'softexetute',

  state: {
    list: [],
    des: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySoftExetute, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *submitData({ payload }, { call, put }) {
      // const response = yield call(querySoftExetute, payload);
      const response = jxreq;
      yield put({
        type: 'savesubmit',
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

    savesubmit(state, action) {
      return {
        ...state,
        des: action.payload,
      };
    },
  },
};

import router from 'umi/router';
import { message } from 'antd';
import { DemandtoDoList } from '../services/api';

export default {
  namespace: 'demandtodo',

  state: {
    list: [],
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(DemandtoDoList, { ...payload });
      console.log(response);
      yield put({
        type: 'save',
        payload: response.data,
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

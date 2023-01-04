import router from 'umi/router';
import { message } from 'antd';
import { userList } from '../services/api';

export default {
  namespace: 'noticesetting',

  state: {
    list: {},
  },

  effects: {
    // 详情操作记录 statusLog
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(userList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

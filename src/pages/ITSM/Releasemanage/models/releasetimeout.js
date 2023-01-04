import { message } from 'antd';
import { TimeoutconfigList, TimeoutdelConfig, TimeoutsaveConfig } from '../services/api';

export default {
  namespace: 'releasetimeout',

  state: {
    list: {},
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(TimeoutconfigList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *update({ payload }, { call }) {
      return yield call(TimeoutsaveConfig, payload);
    },
    *delete({ payload }, { call }) {
      return yield call(TimeoutdelConfig, payload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload || [],
      };
    },
  },
};

import { message } from 'antd';
import { successRate, taskSum } from '../services/api';

export default {
  namespace: 'releasestatistics',

  state: {
    successrate: undefined,
    tasksum: undefined,
  },

  effects: {
    // 列表
    *fetchsuccessrate({ payload }, { call, put }) {
      const response = yield call(successRate, payload);
      yield put({
        type: 'savesuccessrate',
        payload: response.data,
      });
    },
    *fetchtasksum({ payload }, { call, put }) {
      const response = yield call(taskSum, payload);
      yield put({
        type: 'savetasksum',
        payload: response.data,
      });
    },

  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        successrate: undefined,
        chtasksum: undefined,
      };
    },
    savesuccessrate(state, action) {
      return {
        ...state,
        successrate: action.payload,
      };
    },
    savetasksum(state, action) {
      return {
        ...state,
        tasksum: action.payload,
      };
    },
  },
};

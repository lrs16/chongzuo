import { message } from 'antd';
import { successRate, taskSum, objSum, objSumList } from '../services/api';

export default {
  namespace: 'releasestatistics',

  state: {
    successrate: undefined,
    tasksum: undefined,
    objectsum: undefined,
    objeclist: undefined,
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
    *fetchobjectsum({ payload }, { call, put }) {
      const response = yield call(objSum, payload);
      yield put({
        type: 'saveobjectsum',
        payload: response.data,
      });
    },
    *fetchobjectlist({ payload }, { call, put }) {
      const response = yield call(objSumList, payload);
      yield put({
        type: 'saveobjectlist',
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
    saveobjectsum(state, action) {
      return {
        ...state,
        objectsum: action.payload,
      };
    },
    saveobjectlist(state, action) {
      return {
        ...state,
        objeclist: action.payload,
      };
    },
  },
};

import { message } from 'antd';
import { orderInfo, orderImg, searchOrder } from '../services/api';

export default {
  namespace: 'releaseview',

  state: {
    list: [],
    historyinfo: undefined,
    currentTaskStatus: undefined,
    tasklinks: [],
    imgblob: '',
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(searchOrder, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchview({ payload: { releaseNo } }, { call, put }) {
      const response = yield call(orderInfo, releaseNo);
      if (response.code === 200)
        yield put({
          type: 'saveinfo',
          payload: { historyinfo: response.data.data, currentTaskStatus: response.data.currentTaskStatus, tasklinks: response.data.tasklinks },
        });
    },

    // 流程图
    *flowimg({ payload: { processInstanceId } }, { call, put }) {
      const response = yield call(orderImg, processInstanceId);
      yield put({
        type: 'saveimg',
        payload: response,
      });
    },

  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        historyinfo: undefined,
        currentTaskStatus: undefined,
        tasklinks: [],
        imgblob: '',
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload || [],
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        historyinfo: action.payload.historyinfo,
        currentTaskStatus: action.payload.currentTaskStatus,
        tasklinks: action.payload.tasklinks,
      };
    },
    saveimg(state, action) {
      return {
        ...state,
        imgblob: action.payload,
      };
    },
  },
};

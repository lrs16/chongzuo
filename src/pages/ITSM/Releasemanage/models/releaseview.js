import { message } from 'antd';
import { orderInfo, orderImg, searchOrder, getOpenLastList } from '../services/api';

export default {
  namespace: 'releaseview',

  state: {
    list: [],
    historyinfo: undefined,
    currentTaskStatus: undefined,
    tasklinks: [],
    imgblob: '',
    processLinks: undefined,
    viewlist: {},
    viewmsg: '',
  },

  effects: {
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },
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
          payload: {
            historyinfo: response.data.data,
            currentTaskStatus: response.data.currentTaskStatus,
            tasklinks: response.data.tasklinks,
            processLinks: response.data.processLinks,
          },
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

    // 查看清单
    *viewlist({ payload: { releaseNo } }, { call, put }) {
      const response = yield call(getOpenLastList, releaseNo);
      if (response.code === 200) {
        yield put({
          type: 'saveview',
          payload: response.data,
        });
      } else {
        message.error(response.msg)
      }
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
        processLinks: [],
        viewlist: {},
        viewmsg: ''
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
        processLinks: action.payload.processLinks,
      };
    },
    saveimg(state, action) {
      return {
        ...state,
        imgblob: action.payload,
      };
    },

    saveview(state, action) {
      return {
        ...state,
        viewlist: action.payload.dutyUnitList || {},
        viewmsg: action.payload.dutyUnitListMsg || '',
      };
    },
  },
};

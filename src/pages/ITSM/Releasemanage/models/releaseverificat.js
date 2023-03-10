import { message } from 'antd';
import { bizTodoList, openBizTodoList, openBizTodoView, bizCheckTodo } from '../services/api';

export default {
  namespace: 'releaseverificat',

  state: {
    list: [],
    checklist: [],
    totals: 0,
    checktotals: 0,
    info: [],
    viewlist: {},
    viewmsg: '',
    taskName: undefined,
  },

  effects: {
    // 业务验证列表
    *fetchlist({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(bizTodoList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    // 业务复核列表
    *fetchchecklist({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(bizCheckTodo, payload);
      yield put({
        type: 'savecheck',
        payload: response.data,
      });
    },

    // 打开待办
    *openflow({ payload, noclear }, { call, put }) {
      if (!noclear) {
        yield put({
          type: 'clearcache',
        });
      };
      const response = yield call(openBizTodoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveinfo',
          payload: { info: response.data, taskName: response.taskName },
        });
      } else {
        message.error(response.msg)
      }
    },
    // 查看清单
    *viewlist({ payload }, { call, put }) {
      const response = yield call(openBizTodoView, payload);
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
        list: [],
        checklist: [],
        totals: 0,
        checktotals: 0,
        info: [],
        viewlist: {},
        viewmsg: ''
      };
    },
    clearchecklist(state) {
      return {
        ...state,
        checklist: [],
      };
    },
    clearlist(state) {
      return {
        ...state,
        list: [],
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload.records,
        totals: action.payload.total,
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload.info || [],
        taskName: action.payload.taskName
      };
    },
    saveview(state, action) {
      return {
        ...state,
        viewlist: action.payload.dutyUnitList || {},
        viewmsg: action.payload.dutyUnitListMsg || '',
      };
    },
    savecheck(state, action) {
      return {
        ...state,
        checklist: action.payload.records,
        checktotals: action.payload.total,
      };
    },
  },
};

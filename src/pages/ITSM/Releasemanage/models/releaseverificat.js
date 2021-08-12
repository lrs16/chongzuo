import { message } from 'antd';
import { bizTodoList, openBizTodoList, openBizTodoView } from '../services/api';

export default {
  namespace: 'releaseverificat',

  state: {
    list: [],
    totals: 0,
    info: [],
    viewlist: {},
    viewmsg: ''
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(bizTodoList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    // 打开待办
    *openflow({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(openBizTodoList, payload);
      // const infomap = new Map([
      //   ['出厂测试', response.data.register],
      //   ['平台验证', response.data.platformValidate],
      //   ['业务验证', response.data.bizValidateParam],
      // ]);
      if (response.code === 200) {
        yield put({
          type: 'saveinfo',
          payload: response.data,
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
        list: undefined,
        info: undefined,
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
        info: action.payload,
      };
    },
    saveview(state, action) {
      return {
        ...state,
        viewlist: action.payload.dutyUnitList,
        viewmsg: action.payload.dutyUnitListMsg,
      };
    },
  },
};

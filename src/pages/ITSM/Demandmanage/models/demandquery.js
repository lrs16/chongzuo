import router from 'umi/router';
import { message } from 'antd';
import { DemandQuery, QueryDetail, QueryExport } from '../services/api';

export default {
  namespace: 'demandquery',

  state: {
    list: [],
    info: undefined,
  },

  effects: {
    // 查询列表
    *querylist({ payload }, { call, put }) {
      const response = yield call(DemandQuery, { ...payload });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 查询详情
    *detail({ payload: { processInstanceId } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(QueryDetail, processInstanceId);
      yield put({
        type: 'saveinfo',
        payload: response.data,
      });
    },
    // 查询导出
    *download({ payload }, { call }) {
      return yield call(QueryExport, payload);
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        info: undefined,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};

import router from 'umi/router';
import { message } from 'antd';
import { DemandQuery, QueryDetail, QueryExport } from '../services/api';

export default {
  namespace: 'demandquery',

  state: {
    list: [],
    info: '',
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
      const response = yield call(QueryDetail, processInstanceId);
      yield put({
        type: 'saveinfo',
        payload: response.data,
      });
    },
    // 查询导出
    *download(_, { call }) {
      return yield call(QueryExport);
    },
  },

  reducers: {
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

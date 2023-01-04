import { DemandQuery, QueryDetail, QueryExport, demandstatidetailData, demandstatidetailDownload } from '../services/api';

export default {
  namespace: 'demandquery',

  state: {
    list: [],
    info: undefined,
    demandquerylists: [], // 统计分析-工单明细-数据钻取
  },

  effects: {
    // 查询列表
    *querylist({ payload }, { call, put }) {
      yield put({
        type: 'clearcache'
      })
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

    // 需求统计分析-工单明细-数据钻取
    *getdemandstatidetailData({ payload }, { call, put }) {
      yield put({
        type: 'clearcache'
      })
      const response = yield call(demandstatidetailData, payload);
      yield put({
        type: 'demandquerylist',
        payload: response,
      });
    },

    // 需求统计分析-工单明细-数据钻取
    *statidetailDownload({ payload }, { call }) {
      return yield call(demandstatidetailDownload, payload);
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        info: undefined,
        demandquerylists: [],
        list: [],
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
    // 统计分析-工单明细
    demandquerylist(state, action) {
      return {
        ...state,
        demandquerylists: action.payload.data,
      };
    },
  },
};

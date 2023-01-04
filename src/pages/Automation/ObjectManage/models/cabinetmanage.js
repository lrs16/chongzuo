import {
  CabinetList,
  updateCabinet,
  deleteCabinet,
  CabinetqueryExport,
  downloadCabinetTemplate, // 下载导入模板
} from '../services/api';

export default {
  namespace: 'cabinetmanage',

  state: {
    cabinetList: {}
  },

  effects: {
    // 获取机柜列表
    *findCabinetList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(CabinetList, values, pageNum, pageSize);
      yield put({
        type: 'cabinetList',
        payload: response.data,
      });
    },

    // 机柜-新增/编辑
    *toUpdateCabinet({ payload }, { call }) {
      return yield call(updateCabinet, payload);
    },

    // 机柜-删除
    *toDeleteCabinet({ payload }, { call }) {
      return yield call(deleteCabinet, payload);
    },

    // 机柜-导出
    *download({ payload }, { call }) {
      return yield call(CabinetqueryExport, payload);
    },

    // 机柜-下载导入模板
    *downloadTemplate(_, { call }) {
      return yield call(downloadCabinetTemplate)
    }
  },

  reducers: {
    cabinetList(state, action) {
      return {
        ...state,
        cabinetList: action.payload,
      };
    },
  },
};

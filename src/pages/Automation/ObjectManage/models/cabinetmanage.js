import {
  CabinetList,
  updateCabinet,
  deleteCabinet,
} from '../services/api';

export default {
  namespace: 'cabinetmanage',

  state: {
    cabinetList: {}
  },

  effects: {
    // 获取机柜列表
    *findCabinetList({ payload }, { call, put }) {
      const response = yield call(CabinetList, payload);
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

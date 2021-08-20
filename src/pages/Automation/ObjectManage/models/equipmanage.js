import {
  EquipList,
  updateEquip,
  deleteEquip,
  getCabinetMsg, // 根据编号获取机柜信息
} from '../services/api';

export default {
  namespace: 'equipmanage',

  state: {
    equipList: {}
  },

  effects: {
    // 获取机柜列表
    *findEquipList({ payload }, { call, put }) {
      const response = yield call(EquipList, payload);
      yield put({
        type: 'equipList',
        payload: response.data,
      });
    },

    // 机柜-新增/编辑
    *toupdateEquip({ payload }, { call }) {
      return yield call(updateEquip, payload);
    },

    *getCabinetMsgs({ payload }, { call }) {
      return yield call(getCabinetMsg, payload);
    },

    // 机柜-删除
    *toDeleteEquip({ payload }, { call }) {
      return yield call(deleteEquip, payload);
    },
  },

  reducers: {
    equipList(state, action) {
      return {
        ...state,
        equipList: action.payload,
      };
    },
  },
};

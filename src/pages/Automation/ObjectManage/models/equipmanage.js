import {
  EquipList,
  updateEquip,
  deleteEquip,
  getCabinetMsg, // 根据编号获取设备信息
  EquipqueryExport,
  downloadEquipTemplate, // 下载导入模板
} from '../services/api';

export default {
  namespace: 'equipmanage',

  state: {
    equipList: {}
  },

  effects: {
    // 获取设备列表
    *findEquipList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(EquipList, values, pageNum, pageSize);
      yield put({
        type: 'equipList',
        payload: response.data,
      });
    },

    // 设备-新增/编辑
    *toupdateEquip({ payload }, { call }) {
      return yield call(updateEquip, payload);
    },

    *getCabinetMsgs({ payload }, { call }) {
      return yield call(getCabinetMsg, payload);
    },

    // 设备-删除
    *toDeleteEquip({ payload }, { call }) {
      return yield call(deleteEquip, payload);
    },

    // 设备-导出
    *download({ payload }, { call }) {
      return yield call(EquipqueryExport, payload);
    },

    // 设备-下载导入模板
    *downloadTemplate(_, { call }) {
      return yield call(downloadEquipTemplate)
    }
    
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

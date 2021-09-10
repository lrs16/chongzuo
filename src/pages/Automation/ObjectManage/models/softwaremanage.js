import {
  SoftList,
  addSoft,
  editSoft,
  deleteSoft,
  // 软件属性
  dynamicaddOrEdit, // 新增或编辑
  deleteDynamic, // 删除
  findDynamic, // 获取软件下的所有属性配置
  getfindCascade, // 关联查询区域，查询主机名称，查询主机ip
} from '../services/api';

export default {
  namespace: 'softwaremanage',

  state: {
    softList: {},
    // dynamicList: {},
  },

  effects: {
    // 获取软件列表
    *findSoftList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(SoftList, values, pageNum, pageSize);
      yield put({
        type: 'softList',
        payload: response.data,
      });
    },

    *findSoftList1({ payload: { values, pageNum, pageSize } }, { call }) {
      return yield call(SoftList, values, pageNum, pageSize);
    },

    // 关联查询区域，查询主机名称，查询主机ip
    *tofindCascade({ payload }, { call }) {
      return yield call(getfindCascade, payload);
    },

    // 软件-新增
    *toaddSoft({ payload }, { call }) {
      return yield call(addSoft, payload);
    },

    // 软件-编辑
    *toeditSoft({ payload }, { call }) {
      return yield call(editSoft, payload);
    },

    // 软件-删除
    *todeleteSoft({ payload }, { call }) {
      return yield call(deleteSoft, payload);
    },

    // 软件属性
    *todynamicaddOrEdit({ payload }, { call }) { // 新增或编辑
      return yield call(dynamicaddOrEdit, payload);
    },
    *todeleteDynamic({ payload }, { call }) { // 删除
      return yield call(deleteDynamic, payload);
    },
    *tofindDynamic({ payload: { softId, pageNum, pageSize } }, { call }) { // 获取软件下的所有属性配置
      return yield call(findDynamic, softId, pageNum, pageSize);
      // yield put({
      //   type: 'dynamicList',
      //   payload: response.data,
      // });
    },
  },

  reducers: {
    softList(state, action) {
      return {
        ...state,
        softList: action.payload,
      };
    },

    // dynamicList(state, action) {
    //   return {
    //     ...state,
    //     dynamicList: action.payload,
    //   };
    // },
  },
};

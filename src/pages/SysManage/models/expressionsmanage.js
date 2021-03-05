import {
  queryExpressions,
  getAndField,
  saveExpressions,
  updateExpressions,
  deleteExpressions,
  updateStatusExpressions,
} from '../services/api';

export default {
  namespace: 'expressionsmanage',

  state: {
    list: [],
  },

  effects: {
    // 查询
    *query({ payload: { field, content, status, pageIndex, pageSize } }, { call, put }) {
      const response = yield call(queryExpressions, field, content, status, pageIndex, pageSize);
      yield put({
        type: 'show',
        payload: response.data.rows,
      });
    },

    // 获取
    *getexpressions({ payload }, { call }) {
      return yield call(getAndField, payload);
    },

    // 保存
    *save({ payload }, { call }) {
      return yield call(saveExpressions, payload);
    },

    // 更新
    *update({ payload }, { call }) {
      return yield call(updateExpressions, payload);
    },

    // 删除
    *delete({ payload }, { call }) {
      return yield call(deleteExpressions, payload);
    },

    // 修改常用语状态
    *dupdatestatus({ payload }, { call, put }) {
      const response = yield call(updateStatusExpressions, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

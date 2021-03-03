import {
  queryExpressions,
  getExpressionsByContentAndField,
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
    *query({ payload: { field, content, status } }, { call, put }) {
      const response = yield call(queryExpressions, field, content, status);
      yield put({
        type: 'show',
        payload: response.data,
      });
    },

    // 获取
    *getexpressions({ payload }, { call }) {
      return yield call(getExpressionsByContentAndField, payload);
    },

    // 保存
    *save({ payload }, { call, put }) {
      const response = yield call(saveExpressions, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 更新
    *update({ payload }, { call, put }) {
      const response = yield call(updateExpressions, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 删除
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteExpressions, payload);
      yield put({
        type: 'show',
        payload: response,
      });
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

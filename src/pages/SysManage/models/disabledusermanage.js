import {
  queryDisableduser,
  getAndField,
  saveDisableduser,
  updateDisableduser,
  deleteDisableduser,
} from '../services/api';

export default {
  namespace: 'disabledusermanage',

  state: {
    list: [],
  },

  effects: {
    // 查询
    *query({ payload }, { call, put }) {
      const response = yield call(queryDisableduser, payload);
      yield put({
        type: 'show',
        payload: response.data,
      });
    },

    // 获取
    *getexpressions({ payload }, { call }) {
      return yield call(getAndField, payload);
    },

    // 保存
    *save({ payload }, { call }) {
      return yield call(saveDisableduser, payload);
    },

    // 更新
    *update({ payload }, { call }) {
      return yield call(updateDisableduser, payload);
    },

    // 删除
    *delete({ payload }, { call }) {
      return yield call(deleteDisableduser, payload);
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

import { queryDeptList, UpdateDept, removeDept, searchDept } from '../services/api';

export default {
  namespace: 'upmsdept',

  state: {
    data: [],
  },

  effects: {
    *fetchdatas({ payload }, { call, put }) {
      const response = yield call(queryDeptList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 添加或编辑
    *update({ payload }, { call }) {
      return yield call(UpdateDept, payload);
    },

    *edite({ payload }, { call }) {
      return yield call(UpdateDept, payload);
    },

    *remove({ payload }, { call }) {
      return yield call(removeDept, payload);
    },

    // 查询数据
    *search({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(searchDept, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

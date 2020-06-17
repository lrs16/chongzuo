import { queryDeptTree } from '@/services/api';
import { queryUsers, UpdateUsers, removeUsers } from '../services/api';

export default {
  namespace: 'usermanage',

  state: {
    data: [],
    depdata: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 添加或编辑
    *update({ payload }, { call }) {
      return yield call(UpdateUsers, payload);
    },

    *remove({ payload: { id } }, { call }) {
      return yield call(removeUsers, id);
    },

    // 请求组织结构
    *fetchdept({ payload }, { call, put }) {
      const response = yield call(queryDeptTree, payload);
      //  console.log(response.data);
      yield put({
        type: 'getdept',
        payload: response.data,
      });
    },
    // 请求角色列表
    *fetchrole({ payload }, { call, put }) {
      const response = yield call(queryDeptTree, payload);
      //  console.log(response.data);
      yield put({
        type: 'getdept',
        payload: response.data,
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
    getdept(state, action) {
      return {
        ...state,
        depdata: action.payload,
      };
    },
  },
};

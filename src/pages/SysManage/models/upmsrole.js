import { queryRoleList, UpdateRole, removeRole, searchRole, queryRolemenu } from '../services/api';

export default {
  namespace: 'upmsrole',

  state: {
    data: [],
  },

  effects: {
    *fetchdatas({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 添加或编辑
    *update({ payload }, { call }) {
      return yield call(UpdateRole, payload);
    },

    *edite({ payload }, { call }) {
      return yield call(UpdateRole, payload);
    },

    *remove({ payload }, { call }) {
      return yield call(removeRole, payload);
    },

    // 查询数据
    *search({ payload }, { call }) {
      return yield call(searchRole, payload);
    },

    // 设置菜单权限
    *updatemune({ payload }, { call }) {
      return yield call(queryRolemenu, payload);
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

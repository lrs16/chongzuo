import { queryRoleList, updateUserRole, queryUserRole } from '../services/api';

export default {
  namespace: 'userrole',

  state: {
    sysrole: [],
    userrole: [],
  },

  effects: {
    // 获取权限列表
    *fetchdatas({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 设置用户权限
    *unpdaterole({ payload: { userId, rolevalue } }, { call }) {
      return yield call(updateUserRole, userId, rolevalue);
    },

    // 获取用户权限
    *queryrole({ payload: { userId } }, { call, put }) {
      const response = yield call(queryUserRole, userId);
      yield put({
        type: 'roledatas',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        sysrole: action.payload.data,
      };
    },
    roledatas(state, action) {
      return {
        ...state,
        userrole: action.payload.data,
      };
    },
  },
};

import {
  queryRoleList,
  UpdateRole,
  disposeRolemenu,
  removeRole,
  searchRole,
  queryRolemenu,
} from '../services/api';

export default {
  namespace: 'upmsrole',

  state: {
    data: [],
    rolemenus: [],
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
    *disposemune({ payload: { roleId } }, { call }) {
      return yield call(disposeRolemenu, roleId);
    },

    // 获取菜单权限
    *ruerymune({ payload: { roleId } }, { call, put }) {
      console.log(roleId);
      const response = yield call(queryRoleList, roleId);
      yield put({
        type: 'menudatas',
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
    menudatas(state, action) {
      return {
        ...state,
        rolemenus: action.payload,
      };
    },
  },
};

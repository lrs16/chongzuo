import {
  queryRoleList,
  UpdateRole,
  updateRolemenu,
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

    *remove({ payload: { id } }, { call }) {
      return yield call(removeRole, id);
    },

    // 查询数据
    *search({ payload }, { call , put}) {
      const response = yield call(searchRole, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 设置菜单权限
    *disposemune({ payload: { roleId } }, { call }) {
      return yield call(updateRolemenu, roleId);
    },

    // 获取菜单权限
    *querymune({ payload: { roleId } }, { call, put }) {
      const response = yield call(queryRolemenu, roleId);
      //     console.log(response);
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

import {
  queryMenuList,
  updateRolemenu,
  queryRolemenu,
} from '../services/api';

export default {
  namespace: 'rolemenu',

  state: {
    sysmenu: [],
    rolemenus: [],
  },

  effects: {
    // 获取系统菜单
    *fetchdatas({ payload }, { call, put }) {
      const response = yield call(queryMenuList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 设置菜单权限
    *unpdatemune({ payload: { roleId,menuvalue } }, { call }) {
      return yield call(updateRolemenu, roleId,menuvalue);
    },

    // 获取菜单权限
    *querymune({ payload: { roleId } }, { call, put }) {
      const response = yield call(queryRolemenu, roleId);
      yield put({
        type: 'menudatas',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        sysmenu: action.payload,
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

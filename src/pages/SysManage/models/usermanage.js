import { queryDeptTree } from '@/services/api';
import {
  // queryUsers,
  resetUsers,
  UpdateUsers,
  removeUsers,
  SearchUsers,
  queryUserRole,
  queryUserMenu,
} from '../services/api';

export default {
  namespace: 'usermanage',

  state: {
    data: [],
    depdata: {},
    userrole: [],
    usermenu: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(SearchUsers, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 添加或编辑
    *update({ payload }, { call }) {
      return yield call(UpdateUsers, payload);
    },
    // 删除
    *remove({ payload: { id } }, { call }) {
      return yield call(removeUsers, id);
    },
    //  重置密码
    *reset({payload:{ id }},{ call }) {
      return yield call(resetUsers,id);
    },
    // 查询
    *search({ payload }, { call, put }) {
      const response = yield call(SearchUsers, payload);
      yield put({
        type: 'show',
        payload: response,
      });
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

    // 根据ID请求用户角色
    *fetchuserrole({ payload: { userId } }, { call, put }) {
      const response = yield call(queryUserRole, userId);
      yield put({
        type: 'getrole',
        payload: response.data,
      });
    },

    // 根据ID请求用户菜单
    *fetchusermenu({ payload: { userId } }, { call, put }) {
      const response = yield call(queryUserMenu, userId);

      yield put({
        type: 'getmenu',
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
    getrole(state, action) {
      return {
        ...state,
        userrole: action.payload,
      };
    },
    getmenu(state, action) {
      return {
        ...state,
        usermenu: action.payload,
      };
    },
  },
};

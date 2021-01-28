import {
  queryDeptList,
  UpdateDept,
  EditeDept,
  removeDept,
  searchDept,
  NeedDeptTree,
} from '../services/api';

export default {
  namespace: 'upmsdept',

  state: {
    data: [],
    treedata: '',
  },

  effects: {
    *fetchdatas({ payload }, { call, put }) {
      const response = yield call(queryDeptList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 添加
    *update({ payload }, { call }) {
      return yield call(UpdateDept, payload);
    },
    // 编辑
    *edite({ payload }, { call }) {
      return yield call(EditeDept, payload);
    },

    *remove({ payload: { id } }, { call }) {
      return yield call(removeDept, id);
    },

    // 查询数据
    *search({ payload }, { call, put }) {
      const response = yield call(searchDept, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 按需加载树
    *needtree({ payload }, { call, put }) {
      const response = yield call(NeedDeptTree, payload);
      yield put({
        type: 'showtree',
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
    showtree(state, action) {
      return {
        ...state,
        treedata: action.payload,
      };
    },
  },
};

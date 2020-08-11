import {
  queryProcessList,
  searchProcess,
  addProcess,
  removeProcess,
  editeProcess,
} from '../services/api';

export default {
  namespace: 'upmsprocess',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      //进程列表数据
      const response = yield call(queryProcessList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 查询数据
    *search({ payload }, { call }) {
      return yield call(searchProcess, payload);
    },
    // 编辑表格数据
    *edite({ payload }, { call }) {
      return yield call(editeProcess, payload);
    },
    //添加表格数据
    *add({ payload }, { call }) {
      return yield call(addProcess, payload);
    },
    // 删除表格数据
    *remove({ payload }, { call }) {
      return yield call(removeProcess, payload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

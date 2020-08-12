import {
  // queryProcessList,
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
    *fetch(_, { call, put }) {
      //进程列表数据
      const response = yield call(searchProcess);
      console.log(response);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    // 查询数据
    *search({ payload }, { call, put }) {
      const response = yield call(searchProcess, payload);
      yield put({
        type: 'show',
        payload: response,
      });
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
    *remove({ payload: { id } }, { call }) {
      return yield call(removeProcess, id);
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },
  },
};

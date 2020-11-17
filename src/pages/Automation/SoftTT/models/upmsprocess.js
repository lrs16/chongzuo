import {
  // queryProcessList,
  searchProcess,
  addProcess,
  removeProcess,
  editeProcess,
  batchAddprocess
} from '../services/host';

export default {
  namespace: 'upmsprocess',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(searchProcess, { payload });
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

    //  批量添加数据
    *batchAddprocess({ payload }, { call }) {
      return yield call(batchAddprocess, payload);
    },

    // 编辑表格数据
    *edite({ payload }, { call }) {
      return yield call(editeProcess, payload);
    },
    // // 添加表格数据
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

import { queryTimerule, saveTimerule, updateTimerule, deleteTimerule } from '../services/api';

export default {
  namespace: 'timerule',

  state: {
    total: '',
    list: [],
  },

  effects: {
    // 查询
    *query({ payload: { pageIndex, pageSize } }, { call, put }) {
      const response = yield call(queryTimerule, pageIndex, pageSize);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 保存
    *save({ payload }, { call }) {
      return yield call(saveTimerule, payload);
    },

    // 更新
    *update({ payload }, { call }) {
      return yield call(updateTimerule, payload);
    },

    // 删除
    *delete({ payload }, { call }) {
      return yield call(deleteTimerule, payload);
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload.data.rows,
        total: action.payload.data.total,
      };
    },
  },
};

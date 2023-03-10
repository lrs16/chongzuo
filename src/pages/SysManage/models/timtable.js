import { queryTimetable, saveTimetable, updateTimetable, deleteTimetable } from '../services/api';

export default {
  namespace: 'timetable',

  state: {
    total: '',
    list: [],
  },

  effects: {
    // 查询
    *query({ payload: { pageIndex, pageSize } }, { call, put }) {
      const response = yield call(queryTimetable, pageIndex, pageSize);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 保存
    *save({ payload }, { call }) {
      return yield call(saveTimetable, payload);
    },

    // 更新
    *update({ payload }, { call }) {
      return yield call(updateTimetable, payload);
    },

    // 删除
    *delete({ payload }, { call }) {
      return yield call(deleteTimetable, payload);
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

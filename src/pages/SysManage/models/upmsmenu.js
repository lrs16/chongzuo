import { queryMenuList, UpdateMenu, removeMenu, searchMenu } from '../services/api';

export default {
  namespace: 'upmsmenu',

  state: {
    data: [],
  },

  effects: {
    *fetchdatas({ payload }, { call }) {
      return yield call(queryMenuList, payload);
    },
    // 添加或编辑
    *update({ payload }, { call }) {
      return yield call(UpdateMenu, payload);
    },

    *edite({ payload }, { call }) {
      return yield call(UpdateMenu, payload);
    },

    *remove({ payload: { id } }, { call }) {
      return yield call(removeMenu, id);
    },

    // 查询数据
    *search({ payload }, { call, put }) {
      const response = yield call(searchMenu, payload);
      yield put({
        type: 'show',
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
  },
};

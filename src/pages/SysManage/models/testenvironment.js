import { releaseConfigList, releasesaveConfig, releasedelConfig } from '../services/api';

export default {
  namespace: 'testenvironment',

  state: {
    list: {},
    statusY: undefined,
  },

  effects: {
    // 查询
    *query({ payload }, { call, put }) {
      const response = yield call(releaseConfigList, payload);
      yield put({
        type: 'show',
        payload: response.data,
      });
    },

    *querystatusY({ payload }, { call, put }) {
      const response = yield call(releaseConfigList, payload);
      yield put({
        type: 'savestatus',
        payload: response.data,
      });
    },

    // 保存
    *save({ payload }, { call }) {
      return yield call(releasesaveConfig, payload);
    },

    // 删除
    *delete({ payload }, { call }) {
      return yield call(releasedelConfig, payload);
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: { data: action.payload.records, total: action.payload.total, },
      };
    },
    savestatus(state, action) {
      return {
        ...state,
        statusY: action.payload.records,
      };
    },
  },
};

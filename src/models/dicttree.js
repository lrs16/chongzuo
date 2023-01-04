import { querDictTree, querkeyVal, queryChildDictLower } from '@/services/api';

export default {
  namespace: 'dicttree',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querDictTree, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *keyval({ payload: { dictModule, dictType } }, { call }) {
      return yield call(querkeyVal, dictModule, dictType);
    },
    *childdictLower({ payload }, { call }) {
      return yield call(queryChildDictLower, payload);
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

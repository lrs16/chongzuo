import {
  searchModels,
  saveModels,
  deleteModels
} from '../services/api';

export default {
  namespace: 'processmanagement',

  state: {
    list:[]
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(searchModels, payload);
      yield put({
        type: 'getlist',
        payload: response,
      });
    },

    *modelSave({ payload }, { call }) {
      return yield call(saveModels, payload);
    },

    *modelDelete({ payload: { id }}, { call }) {
      return yield call(deleteModels,id)
    }
  },

  reducers: {
    getlist(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },

  },
};

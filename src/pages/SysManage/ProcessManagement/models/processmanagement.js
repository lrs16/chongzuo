import {
  searchModels,
  saveModels,
  deleteModels,
  editModels
} from '../services/api';

export default {
  namespace: 'processmanagement',

  state: {
    list:[],
    editInfo:[],
    reshtml:'',
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
    },

    *editModels({ payload: { modelsId }}, { call, put }) {
      const response = yield call(editModels,modelsId);
      yield put({
        type: 'gethtml',
        payload: response,
      });
     // return yield call(editModels,modelsId);
    }


  },

  reducers: {
    getlist(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },
    gethtml(state, action) {
      return {
        ...state,
        reshtml: action.payload,
      };
    },
  },
};

import {
  queryHostList,
  savaHostInfo,
  editHostInfo,
  removeHostInfo,
  querySoftList,
  querySaveSoft,
  queryEditSoft,
  queryRemoveSoft,
  queryProcessList,
  queryProcessEdit,
  processRemove,
  queryProcessSave,
} from '../services/api';

export default {
  namespace: 'automaticmodel',

  state: {
    list: [],
    softdata: [],
    processdata: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHostList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *update({ payload }, { call }) {
      return yield call(savaHostInfo, payload);
    },

    *edit({ payload }, { call }) {
      return yield call(editHostInfo, payload);
    },

    *remove({ payload }, { call }) {
      return yield call(removeHostInfo, payload);
    },

    //软件的接口请求
    *fetchsoftlist({ payload }, { call, put }) {
      const response = yield call(querySoftList, payload);
      yield put({
        type: 'softlist',
        payload: response,
      });
    },

    *softSave({ payload }, { call }) {
      return yield call(querySaveSoft, payload);
    },

    *softEdit({ payload }, { call }) {
      return yield call(queryEditSoft, payload);
    },

    *softRemove({ payload }, { call }) {
      return yield call(queryRemoveSoft, payload);
    },

    //进程的接口
    *fetchprocessList({ payload }, { call, put }) {
      const response = yield call(queryProcessList, payload);
      yield put({
        type: 'processlist',
        payload: response,
      });
    },

    *processEdit({ payload }, { call }) {
      return yield call(queryProcessEdit, payload);
    },

    *processRemove({ payload }, { call }) {
      return yield call(processRemove, payload);
    },

    *processSave({ payload }, { call }) {
      return yield call(this.processSave, payload);
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

    softlist(state, action) {
      return {
        ...state,
        softdata: action.payload,
      };
    },

    processlist(state, action) {
      return {
        ...state,
        processdata: action.payload,
      };
    },
  },
};

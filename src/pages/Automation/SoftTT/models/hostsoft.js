import {
  myHosts,
  savaHostInfo,
  editHostInfo,
  removeHostInfo,
  searchSofts,
  querySaveSoft,
  queryEditSoft,
  queryRemoveSoft,
} from '../services/host';

export default {
  namespace: 'hostsoft',

  state: {
    hostdata: [],
    softdata: [],
  },

  effects: {
    *fetchhost({ payload }, { call, put }) {
      const response = yield call(myHosts, payload);
      yield put({
        type: 'gethost',
        payload: response,
      });
    },

    *search({ payload }, { call, put }) {
      const response = yield call(myHosts, payload);
      yield put({
        type: 'gethost',
        payload: response,
      });
    },

    *update({ payload }, { call }) {
      return yield call(savaHostInfo, payload);
    },

    *edit({ payload }, { call }) {
      return yield call(editHostInfo, payload);
    },

    *remove({ payload: { id } }, { call }) {
      return yield call(removeHostInfo, id);
    },
    // 软件的接口
    *fetchsoft({ payload }, { call, put }) {
      const response = yield call(searchSofts, payload);
      yield put({
        type: 'softlist',
        payload: response,
      });
    },

    *searchSofts({ payload }, { call, put }) {
      const response = yield call(searchSofts, payload);
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
  },

  reducers: {
    gethost(state, action) {
      return {
        ...state,
        hostdata: action.payload.data,
      };
    },

    softlist(state, action) {
      return {
        ...state,
        softdata: action.payload.data,
      };
    },
  },
};

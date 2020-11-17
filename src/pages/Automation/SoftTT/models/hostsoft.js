import {
  myHosts,
  savaHostInfo,
  editHostInfo,
  removeHostInfo,
  searchSofts,
  querySaveSoft,
  queryEditSoft,
  queryRemoveSoft,
  batchAddhost,
  // batchAddprocess,
  querySoftwaresList,
  queryToHostList, // 树杈数据
} from '../services/host';

export default {
  namespace: 'hostsoft',

  state: {
    hostdata: [],
    softdata: [],
    treesoftdata: [],
    treehostdata: [],
  },

  effects: {
    // 主机
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
    *batchAddhost({payload}, { call }) {
      return yield call(batchAddhost, payload);
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

    *getSoftwaresList({ payload: { hostId } }, { call, put }) {
      const response = yield call(querySoftwaresList, hostId);
      yield put({
        type: 'treesoftdata',
        payload: response,
      });
    },

    *getToHostList({ payload: { hostId } }, { call, put }) {
      const response = yield call(queryToHostList, hostId);
      yield put({
        type: 'treehostdata',
        payload: response.data,
      });
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

    treesoftdata(state, action) {
      return {
        ...state,
        treesoftdata: action.payload.data,
      };
    },

    treehostdata(state, action) {
      return {
        ...state,
        treehostdata: action.payload.data,
      };
    },
  },
};

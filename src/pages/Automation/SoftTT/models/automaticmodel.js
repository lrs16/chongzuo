import {
  savaHostInfo,
  editHostInfo,
  removeHostInfo,
  querySaveSoft,
  queryEditSoft,
  queryRemoveSoft,
  searchHosts,
  searchSofts,
  querySoftwaresList
} from '../services/host';

export default {
  namespace: 'automaticmodel',

  state: {
    data: [],
    softdata: [],
    treesoftdata:[]
  },

  effects: {
    *fetch({ payload: { page, limit, queKey } }, { call, put }) {
      console.log('gg');
      const response = yield call(searchHosts, page, limit, queKey);
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

    *remove({ payload: { id } }, { call }) {
      return yield call(removeHostInfo, id);
    },

    *search({ payload: { page, limit, queKey } }, { call, put }) {
      const response = yield call(searchHosts, page, limit, queKey);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 软件的接口请求
    *fetchsoftlist({ payload }, { call, put }) {
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

    *softSearch({ payload }, { call, put }) {
      const response = yield call(searchSofts, payload);
      yield put({
        type: 'softlist',
        payload: response,
      });
    },

    // 通过主机获取软件的接口
    *getSoftwaresList({ payload: {hostId }}, { call, put}) {
      const response = yield call(querySoftwaresList,hostId);
      yield put({
        type:'treesoftdata',
        payload: response,
      });
    }
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        data: action.payload.data,
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
  },
};

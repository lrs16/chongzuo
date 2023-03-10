import { 
  queryList,
  queryOpenView,
  querydownload,
  querydownloadbyids,
  getOrderObjectByRoot,
  querytimeout,
  downloadOrderObjectByRoot
     } from '../services/api';

export default {
  namespace: 'eventquery',

  state: {
    list: [],
    info: '',
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchopenview({ payload: { mainId } }, { call, put }) {
      const response = yield call(queryOpenView, mainId);
      yield put({
        type: 'saveinfo',
        payload: response.data,
      });
    },
    // 下载
    *eventdownload({ payload: { values, ids } }, { call }) {
      if (ids.length === 0) {
        return yield call(querydownload, { ...values });
      }
      return yield call(querydownloadbyids, ids);
    },

    *fetchgetOrderObjectByRoot({ payload }, { call, put }) {
      const response = yield call(getOrderObjectByRoot, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *fetchquerytimeout({ payload }, { call, put }) {
      const response = yield call(querytimeout, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    
    *fetchdownloadOrderObjectByRoot({ payload }, { call, put }) {
      return yield call(downloadOrderObjectByRoot,payload)
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};

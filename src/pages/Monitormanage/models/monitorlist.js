import { querylisthost, querylistdatabase, queryMonitorGroup } from '../services/api';

export default {
  namespace: 'monitorlist',

  state: {
    // current:'',
    data: [],
    // pageSize:'',
    // total:'',
    databaselist: [],
    monitorGroups: [],
  },

  effects: {
    *fetchhost({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylisthost, current, pageSize);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *fetchdatabase({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylistdatabase, current, pageSize);
      yield put({
        type: 'savedatabase',
        payload: response.data,
      });
    },

    *fetchMonitorGroup(_, { call, put }) {
      const response = yield call(queryMonitorGroup);
      yield put({
        type: 'addMonitorGroup',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, { payload: { data, total, current } }) {
      return {
        ...state,
        data,
        total,
        current,
      };
    },
    savedatabase(state, { payload: { data, total, current } }) {
      return {
        ...state,
        databaselist: data,
        total,
        current,
      };
    },
    addMonitorGroup(state, { payload: data }) {
      return {
        ...state,
        monitorGroups: data,
      };
    },
  },
};

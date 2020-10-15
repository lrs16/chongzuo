import {
  queryHostShh2,
  queryHostShh2Search,
  queryHostShh2List,
  queryExecLog,
  queryExecLogDetail,
  queryHostShh2ExecCommand,
  queryHostEncryptStr,
  querySearchSofts,
  querySoftwaresList,
  queryToHostList, // 树杈数据
} from '../services/api';

export default {
  namespace: 'softexetute',

  state: {
    list: [],
    softdata: [], // 软件数据
    execloglist: [],
    treesoftdata: [],
    treehostdata: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHostShh2List, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    // 软件的接口
    *fetchsoft({ payload }, { call, put }) {
      const response = yield call(querySearchSofts, payload);
      yield put({
        type: 'softlist',
        payload: response,
      });
    },

    // 软件启停-主机_SSH2管理 新建
    *newuserInfo({ payload }, { call }) {
      return yield call(queryHostShh2, payload);
    },

    // 软件启停-主机_SSH2管理 查询
    *getByUserNameAndIp({ payload }, { call }) {
      return yield call(queryHostShh2Search, payload);
    },

    // 软件启停-主机_SSH2管理 执行命令
    *getExecCommand({ payload }, { call }) {
      return yield call(queryHostShh2ExecCommand, payload);
    },

    *getExeclogList({ payload }, { call, put }) {
      const response = yield call(queryExecLog, payload);
      yield put({
        type: 'execloglist',
        payload: response,
      });
    },

    *getExeclogListDEtail({ payload: { id } }, { call }) {
      return yield call(queryExecLogDetail, id);
    },

    *getHostEncryptStr({ payload: { encryptStr } }, { call }) {
      return yield call(queryHostEncryptStr, encryptStr);
    },

    *getSoftwaresList({ payload: { hostId } }, { call, put }) {
      const response = yield call(querySoftwaresList, hostId);
      yield put({
        type: 'treesoftdata',
        payload: response.data,
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
    save(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },

    softlist(state, action) {
      return {
        ...state,
        softdata: action.payload.data,
      };
    },

    execloglist(state, action) {
      return {
        ...state,
        execloglist: action.payload.data,
      };
    },

    treesoftdata(state, action) {
      return {
        ...state,
        treesoftdata: action.payload,
      };
    },

    treehostdata(state, action) {
      return {
        ...state,
        treehostdata: action.payload,
      };
    },
  },
};

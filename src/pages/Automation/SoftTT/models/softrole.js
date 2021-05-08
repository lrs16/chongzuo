import {
  rightShuttlebox,
  updatehostrole,
  softleftShuttle,
  softrightShuttle,
  updatesoftrole,
  searchSofts,
  searchProcess
} from '../services/api';

export default {
  namespace: 'softrole',

  state: {
    leftbox: [],
    rightdata: [],
    jurisdiction: [],
    softleftdata: [],
    processList: [],
  },

  effects: {

    // 右边穿梭框的数据
    *rightShuttlebox({ payload: { hostId } }, { call, put }) {
      const response = yield call(rightShuttlebox, hostId);
      yield put({
        type: 'hostdatas',
        payload: response,
      });
    },

    // 左边
    *fetchsoft({ payload }, { call, put }) {
      const response = yield call(searchSofts, payload);
      yield put({
        type: 'softlist',
        payload: response,
      });
    },

    // 更新权限
    *updatehostrole({ payload: { hostId, softvalue } }, { call, put }) {
      return yield call(updatehostrole, hostId, softvalue);
    },
    // 软件左边穿梭框
    *softleftShuttle({ payload }, { call, put }) {
      const response = yield call(softleftShuttle, payload);
      yield put({
        type: 'softdata',
        payload: response,
      });
    },
    // 软件右边穿梭框
    *softrightShuttle({ payload: { softId } }, { call, put }) {
      const response = yield call(softrightShuttle, softId);
      yield put({
        type: 'processList',
        payload: response,
      });
    },
    // 软件穿梭框里的分页
    *search({ payload }, { call, put }) {
      const response = yield call(searchProcess, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    // 更新软件权限
    *updatesoftrole({ payload: { softwareId, coursevalue } }, { call }) {
      return yield call(updatesoftrole, softwareId, coursevalue);
    },
  },

  reducers: {
    // softlist(state, action) {
    //   return {
    //     ...state,
    //     leftbox: action.payload.data,
    //   };
    // },
    // 主机
    // 左边的数据
    softlist(state, action) {
      return {
        ...state,
        leftbox: action.payload.data,
      };
    },

    // 右边的数据
    hostdatas(state, action) {
      return {
        ...state,
        rightdata: action.payload.data,
      };
    },

    // 软件
    softdata(state, action) {
      return {
        ...state,
        softleftdata: action.payload.data,
      };
    },

    processList(state, action) {
      return {
        ...state,
        processList: action.payload.data,
      };
    },
  },
};

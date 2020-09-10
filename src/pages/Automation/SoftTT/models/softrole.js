import {
  hostShuttlebox,
  softShuttlebox,
  updatehostrole,
  softShuttle,
  processShuttlebox,
  updatesoftrole,
} from '../services/api';
// import Mock from "mockjs";
// const Random = Mock.Random;
// function fakeList(count) {
//   const list = [];
//   for (let i = 0; i < count; i += 1) {
//     list.push({
//       id: Random.integer(1, 100),
//       roleCode: Random.character(),
//       roleName: Random.csentence( 1, 3 ),
//     });
//   }
//   return list;
// }

export default {
  namespace: 'softrole',

  state: {
    hostrole: [],
    softrole: [],
    jurisdiction: [],
    softdata: [],
    processList: [],
  },

  effects: {
    //获取主机权限的列表
    *hostShuttlebox({ payload: { hostId } }, { call, put }) {
      const response = yield call(hostShuttlebox, hostId);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    //获取软件权限的列表
    *softShuttlebox({ payload: { hostId } }, { call, put }) {
      const response = yield call(softShuttlebox, hostId);
      yield put({
        type: 'hostdatas',
        payload: response,
      });
    },

    //更新权限
    *updatehostrole({ payload: { hostId, softvalue } }, { call, put }) {
      return yield call(updatehostrole, hostId, softvalue);
    },

    *softShuttle({ payload }, { call, put }) {
      const response = yield call(softShuttle, payload);
      yield put({
        type: 'softdata',
        payload: response,
      });
    },

    *processShuttlebox({ payload }, { call, put }) {
      const response = yield call(processShuttlebox, payload);
      yield put({
        type: 'processList',
        payload: response,
      });
    },
    //更新软件权限
    *updatesoftrole({ payload: { softwareId, coursevalue } }, { call }) {
      return yield call(updatesoftrole, softwareId, coursevalue);
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        hostrole: action.payload,
      };
    },

    hostdatas(state, action) {
      return {
        ...state,
        softrole: action.payload,
      };
    },

    //软件
    softdata(state, action) {
      return {
        ...state,
        softdata: action.payload,
      };
    },

    processList(state, action) {
      return {
        ...state,
        processList: action.payload,
      };
    },
  },
};

// import Mock from 'mockjs'; // 引入mockjs
import {
  databaseInfo,
  databaseCache,
  instanceStatus,
  userStatus,
  tablespaceUsage,
  databaseConnect,
  timetablespaceUsage,
  databaseEm,
  databaseEmHistroy,
} from '../services/api';

// const { Random } = Mock;

// function mocksystemlist(count) {
//   const list = [];
//   for (let i = 0; i < count; i += 1) {
//     list.push({
//       id: `${i}`,
//       alarmstatus: [0, 1, 2, 3][i % 4],
//       applyLabel: 'windows',
//       status: [0, 1][i % 2],
//       alerContent: Random.cword(
//         '磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
//         20,
//         50,
//       ),
//       time: Random.datetime(),
//     });
//   }
//   return list;
// }

// function mocksystemhistorylist(count) {
//   const list = [];
//   for (let i = 0; i < count; i += 1) {
//     list.push({
//       id: `${i}`,
//       alarmstatus: [0, 1, 2, 3][i % 4],
//       alerContent: Random.cword(
//         '磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
//         20,
//         50,
//       ),
//       time: Random.datetime(),
//     });
//   }
//   return list;
// }

export default {
  namespace: 'databasedetail',

  state: {
    baseinfo: '',
    cachedata: '',
    instancedata: [],
    userdata: [],
    tablespace: [],
    spaceusage: '',
    connetnumber: [],
    currealarms: [],
  },

  effects: {
    //数据库详情
    *fetchdetail({ payload: { databaseId } }, { call, put }) {
      const response = yield call(databaseInfo, databaseId);
      yield put({
        type: 'getddetail',
        payload: response.data,
      });
    },

    //cache命中率
    *fetchcache({ payload: { databaseId } }, { call, put }) {
      const response = yield call(databaseCache, databaseId);
      yield put({
        type: 'getcache',
        payload: response.data,
      });
    },

    // 表空间使用情况
    *fetchtablespace({ payload: { databaseId } }, { call, put }) {
      const response = yield call(tablespaceUsage, databaseId);
      yield put({
        type: 'gettablespace',
        payload: response.data,
      });
    },

    // 当前连接数
    *fetchconnet({ payload: { databaseId } }, { call, put }) {
      const response = yield call(databaseConnect, databaseId);
      yield put({
        type: 'getconnet',
        payload: response.data,
      });
    },

    // 表空间增长趋势
    *fetchspaceusage({ payload: { databaseId, formTime, toTime } }, { call, put }) {
      const response = yield call(timetablespaceUsage, databaseId, formTime, toTime);
      yield put({
        type: 'getspaceusage',
        payload: response.data,
      });
    },

    // 数据库实例状态
    *fetchinstance({ payload: { databaseId, current, pageSize } }, { call, put }) {
      const response = yield call(instanceStatus, databaseId, current, pageSize);
      yield put({
        type: 'getinstance',
        payload: response.data,
      });
    },

    // 用户状态
    *fetchuser({ payload: { databaseId, current, pageSize } }, { call, put }) {
      const response = yield call(userStatus, databaseId, current, pageSize);
      yield put({
        type: 'getuser',
        payload: response.data,
      });
    },

    //当前告警
    *fetchCurrentalarm({ payload: { count } }, { call, put }) {
      const response = yield call(databaseEm, count);
      yield put({
        type: 'getalarm',
        payload: response.data,
      });
    },
    //历史告警
    *fetchhistory({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(databaseEmHistroy, current, pageSize);
      yield put({
        type: 'gethistoryalarm',
        payload: response.data,
      });
    },
    // // 监控指标，最近一次
    // *fetchcurrenthistory({ payload: { applicationId } }, { call, put }) {
    //   const response = yield call(databaseCurrent, applicationId);
    //   yield put({
    //     type: 'getcurrentHistory',
    //     payload: response.data,
    //   });
    // },
    // // 监控指标，其它情况
    // *fetchotherhistory({ payload: { applicationId, formTime, toTime } }, { call, put }) {
    //   const response = yield call(databaseOther, applicationId, formTime, toTime);
    //   yield put({
    //     type: 'getortherHistory',
    //     payload: response.data,
    //   });
    // },
  },

  reducers: {
    getddetail(state, action) {
      return {
        ...state,
        baseinfo: action.payload,
      };
    },
    getcache(state, action) {
      return {
        ...state,
        cachedata: action.payload,
      };
    },
    getinstance(state, action) {
      return {
        ...state,
        instancedata: action.payload,
      };
    },
    getuser(state, action) {
      return {
        ...state,
        userdata: action.payload,
      };
    },
    gettablespace(state, action) {
      return {
        ...state,
        tablespace: action.payload,
      };
    },
    getconnet(state, action) {
      return {
        ...state,
        connetnumber: action.payload,
      };
    },
    getspaceusage(state, action) {
      return {
        ...state,
        spaceusage: action.payload,
      };
    },
    getalarm(state, action) {
      return {
        ...state,
        currealarms: action.payload,
      };
    },
  },
};

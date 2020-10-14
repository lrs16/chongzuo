import Mock from 'mockjs'; // 引入mockjs
import {
  databaseInfo,
  databaseEm,
  databaseEmHistroy,
  databaseCurrent,
  databaseOther,
} from '../services/api';

const { Random } = Mock;

function mocksystemlist(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      alarmstatus: [0, 1, 2, 3][i % 4],
      applyLabel: 'windows',
      status: [0, 1][i % 2],
      alerContent: Random.cword(
        '磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        20,
        50,
      ),
      time: Random.datetime(),
    });
  }
  return list;
}

function mocksystemhistorylist(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      alarmstatus: [0, 1, 2, 3][i % 4],
      alerContent: Random.cword(
        '磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        20,
        50,
      ),
      time: Random.datetime(),
    });
  }
  return list;
}

function mockprocesslist(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `${i}`,
      name: Random.title(1, 4),
      parentid: Random.integer(1, 100),
      threads: Random.integer(0, 50),
      cpuused: Random.integer(0, 50),
      memoryused: Random.integer(30, 100),
      diskused: Random.integer(0, 50),
      network: Random.integer(0, 50),
    });
  }
  return list;
}

export default {
  namespace: 'databasedetail',

  state: {
    baseinfo: '',
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
    getalarm(state, action) {
      return {
        ...state,
        currealarms: action.payload,
      };
    },
  },
};

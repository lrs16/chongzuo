import Mock from 'mockjs'; // 引入mockjs
import { queryapplication, querycurrentHistory, queryotherhistory } from '../services/api';

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
  namespace: 'hostdetail',

  state: {
    sysalarms: [],
    historyalarms: [],
    processlist: [],
    currentHistory: [],
    history: [],
  },

  effects: {
    *fetchsysalarmlist({ payload: { count } }, { call, put }) {
      const response = mocksystemlist(count);

      yield put({
        type: 'getsysalarm',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchhistory(_, { call, put }) {
      const response = mocksystemhistorylist(10);
      yield put({
        type: 'gethistoryalarm',
        // payload: response.data,
        payload: response,
      });
    },
    // 监控指标，最近一次
    *fetchcurrenthistory({ payload: { applicationId } }, { call, put }) {
      const response = yield call(querycurrentHistory, applicationId);
      yield put({
        type: 'getcurrentHistory',
        payload: response.data,
      });
    },
    // 监控指标，其它情况
    *fetchotherhistory({ payload: { applicationId, formTime, toTime } }, { call, put }) {
      const response = yield call(queryotherhistory, applicationId, formTime, toTime);
      yield put({
        type: 'getortherHistory',
        payload: response.data,
      });
    },
    *fetchprocess(_, { call, put }) {
      const response = mockprocesslist(20);
      yield put({
        type: 'getprocess',
        // payload: response.data,
        payload: response,
      });
    },
  },

  reducers: {
    getsysalarm(state, action) {
      return {
        ...state,
        sysalarms: action.payload,
      };
    },
    gethistoryalarm(state, action) {
      return {
        ...state,
        historyalarms: action.payload,
      };
    },
    getprocess(state, action) {
      return {
        ...state,
        processlist: action.payload,
      };
    },
    getcurrentHistory(state, action) {
      return {
        ...state,
        currentHistory: action.payload,
      };
    },
    getortherHistory(state, action) {
      return {
        ...state,
        history: action.payload,
      };
    },
  },
};

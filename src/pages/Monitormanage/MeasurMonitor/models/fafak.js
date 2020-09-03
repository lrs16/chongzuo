import Mock from 'mockjs'; // 引入mockjs
import {
  getKafka3Zone,
  getKafkaSafeZone,
  getKafka2Zone,
  getdownDY,
  getdownOther,
  get102safeZone,
  get102Down,
  getupDY,
  getupOther,
  get102up2Zone,
  get102upSafe2Zone,
  get102upSafeZone,
} from '../services/api';

const { Random } = Mock; // Mock.Random 是一个工具类，用于生成各种随机数据
const Zone3data = {
  name: 'cluster',
  children: [
    {
      // name: '南宁',
      ip: '10.172.208.28',
      state: 0,
    },
    {
      // name: '柳州',
      ip: '10.172.208.36',
      state: 0,
    },
    {
      // name: '桂林',
      ip: '10.172.208.37',
      state: 1,
    },
  ],
};
const SafeZonedata = {
  name: 'cluster',
  children: [
    {
      ip: '10.172.208.28',
      state: 1,
    },
    {
      ip: '10.172.208.36',
      state: 0,
    },
    {
      ip: '10.172.208.37',
      state: 0,
    },
  ],
};
function Mockdowndy() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      // type:['WebDataAsk', 'BlParamRequest', 'AutoDataAsk','WebParamRequest','FkRequest'][i % 5],
      name: 'WebDataAsk',
      alerttip: true,
      value: Random.integer(6000, 6800),
    });
    list.push({
      clock: i % 24,
      name: 'BlParamRequest',
      alerttip: false,
      value: Random.integer(5500, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'AutoDataAsk',
      alerttip: false,
      value: Random.integer(5800, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'WebParamRequest',
      alerttip: false,
      value: Random.integer(3000, 7000),
    });
    list.push({
      clock: i % 24,
      name: 'FkRequest',
      alerttip: false,
      value: Random.integer(6000, 6500),
    });
  }
  return list;
}
function Mockother() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'TaskTopicBg',
      value: Random.integer(2000, 9000),
    });
    list.push({
      clock: i % 24,
      name: 'Gate2FrontTopic',
      value: Random.integer(1000, 9000),
    });
    list.push({
      clock: i % 24,
      name: 'TaskTopicPursue',
      value: Random.integer(1000, 9000),
    });
    list.push({
      clock: i % 24,
      name: 'TkTopicWeb',
      value: Random.integer(1000, 9000),
    });
    list.push({
      clock: i % 24,
      name: 'TaskTopicInterface',
      value: Random.integer(1000, 9000),
    });
  }
  return list;
}
function Mockzone102_2() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'informTopic',
      value: Random.integer(4500, 9000),
    });
    list.push({
      clock: i % 24,
      name: 'requestTopic',
      value: Random.integer(1000, 5000),
    });
  }
  return list;
}
function Mockzone102_safe() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'GK_CJ_SB',
      value: Random.integer(2000, 3000),
    });
    list.push({
      clock: i % 24,
      name: 'GK_CJD',
      value: Random.integer(3000, 4000),
    });
    list.push({
      clock: i % 24,
      name: 'GK_DLCDZD',
      value: Random.integer(4000, 5000),
    });
    list.push({
      clock: i % 24,
      name: 'GK_WL',
      value: Random.integer(5000, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'GK_DB',
      value: Random.integer(6000, 7000),
    });
    list.push({
      clock: i % 24,
      name: 'GK_DL',
      value: Random.integer(1000, 8000),
    });
  }
  return list;
}
function Mockupdy() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'AutoDataAnswer',
      value: Random.integer(2000, 3000),
    });
    list.push({
      clock: i % 24,
      name: 'BlParamResponse',
      value: Random.integer(3000, 4000),
    });
    list.push({
      clock: i % 24,
      name: 'WebDataAnswer',
      value: Random.integer(4000, 5000),
    });
    list.push({
      clock: i % 24,
      name: 'DataObject',
      value: Random.integer(5000, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'FkResponse',
      value: Random.integer(6000, 7000),
    });
    list.push({
      clock: i % 24,
      name: 'FrontReportTopic',
      value: Random.integer(1000, 8000),
    });
    list.push({
      clock: i % 24,
      name: 'WebParamResponse',
      value: Random.integer(6000, 7000),
    });
    list.push({
      clock: i % 24,
      name: 'TmnlStatus',
      value: Random.integer(1000, 8000),
    });
  }
  return list;
}
function Mockupother() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'Front2GateTopic',
      value: Random.integer(2000, 3000),
    });
    list.push({
      clock: i % 24,
      name: 'RespTopicWeb',
      value: Random.integer(3000, 4000),
    });
    list.push({
      clock: i % 24,
      name: 'RespTopicBg    ',
      value: Random.integer(4000, 5000),
    });
    list.push({
      clock: i % 24,
      name: 'RespTopicInterface',
      value: Random.integer(5000, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'RespTopicBg',
      value: Random.integer(1000, 9000),
    });
  }
  return list;
}
function Mockup102_2zone() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'ERTU_EVENT',
      value: Random.integer(2000, 3000),
    });
    list.push({
      clock: i % 24,
      name: 'CHANNEL_STATUS',
      value: Random.integer(3000, 4000),
    });
    list.push({
      clock: i % 24,
      name: 'HIS_MEAS_ACQ',
      value: Random.integer(4000, 5000),
    });
    list.push({
      clock: i % 24,
      name: 'ERTU_TIME_DATA',
      value: Random.integer(5000, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'DAY_DEMAND',
      value: Random.integer(6000, 7000),
    });
    list.push({
      clock: i % 24,
      name: 'HIS_TARIFF_ACQ',
      value: Random.integer(1000, 9000),
    });
  }
  return list;
}
function Mocksafe102_2zone() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'HIS_VIEW_ACQ',
      value: Random.integer(2000, 3000),
    });
    list.push({
      clock: i % 24,
      name: 'RequestAnswerTopic',
      value: Random.integer(3000, 4000),
    });
    list.push({
      clock: i % 24,
      name: 'TmnlStatus',
      value: Random.integer(4000, 5000),
    });
    list.push({
      clock: i % 24,
      name: 'IAS_REPORT',
      value: Random.integer(5000, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'RespTopicWeb',
      value: Random.integer(6000, 7000),
    });
  }
  return list;
}
function Mockup102safe() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      name: 'INFOUPDATE',
      value: Random.integer(2000, 3000),
    });
    list.push({
      clock: i % 24,
      name: 'TASKLOG    ',
      value: Random.integer(1000, 4000),
    });
  }
  return list;
}
export default {
  namespace: 'fafak',

  state: {
    zone3data: {}, // 3区KAFKA节点
    safezonedata: {}, // 安全接入区KAFKA节点
    zone2data: {}, // 2区KAFKA节点
    downdydata: {}, // 下行主题低压相关
    otherdata: {}, // 其他回复接口（低压相关）
    zone102_2data: {}, //
    down102: {},
    updydata: {},
    upotherdata: {},
    up102_2zonedata: {},
    safe102_2zonedata: {},
    up102safezone: {},
  },

  effects: {
    *fetch3zone(_, { call, put }) {
      // const response = yield call(getKafka3Zone);
      yield put({
        type: 'get3zone',
        // payload: response.data,
        payload: Zone3data,
      });
    },
    *fetchsafezone(_, { call, put }) {
      // const response = yield call(getKafkaSafeZone);
      yield put({
        type: 'getsafezone',
        // payload: response.data,
        payload: SafeZonedata,
      });
    },
    *fetch2zone(_, { call, put }) {
      // const response = yield call(getKafka2Zone);
      yield put({
        type: 'get2zone',
        // payload: response.data,
        payload: SafeZonedata,
      });
    },
    *fetchdoendy(_, { call, put }) {
      // const response = yield call(getdownDY);
      const response = Mockdowndy();
      yield put({
        type: 'getdowndy',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchdownother(_, { call, put }) {
      // const response = yield call(getdownOther);
      const response = Mockother();
      yield put({
        type: 'getdownother',
        // payload: response.data,
        payload: response,
      });
    },
    *fetch102safezone(_, { call, put }) {
      // const response = yield call(get102safeZone);
      const response = Mockzone102_2();
      yield put({
        type: 'get102safezone',
        payload: response.data,
        // payload: response,
      });
    },
    *fetch102down(_, { call, put }) {
      const response = yield call(get102Down);
      // const response = Mockzone102_safe();
      yield put({
        type: 'get102down',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchupdy(_, { call, put }) {
      // const response = yield call(getupDY);
      const response = Mockupdy();
      yield put({
        type: 'getupdy',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchupother(_, { call, put }) {
      // const response = yield call(getupOther);
      const response = Mockupother();
      yield put({
        type: 'getupother',
        // payload: response.data,
        payload: response,
      });
    },
    *fetch102up2zone(_, { call, put }) {
      // const response = yield call(get102up2Zone);
      const response = Mockup102_2zone();
      yield put({
        type: 'getup102_2zone',
        // payload: response.data,
        payload: response,
      });
    },
    *fetch102safe2zone(_, { call, put }) {
      // const response = yield call(get102upSafe2Zone);
      const response = Mocksafe102_2zone();
      yield put({
        type: 'getsafe102_2zone',
        // payload: response.data,
        payload: response,
      });
    },
    *fetch102upsafezone(_, { call, put }) {
      // const response = yield call(get102upSafeZone);
      const response = Mockup102safe();
      yield put({
        type: 'getsafe102zone',
        // payload: response.data,
        payload: response,
      });
    },
  },

  reducers: {
    get3zone(state, action) {
      return {
        ...state,
        zone3data: action.payload,
      };
    },
    getsafezone(state, action) {
      return {
        ...state,
        safezonedata: action.payload,
      };
    },
    get2zone(state, action) {
      return {
        ...state,
        zone2data: action.payload,
      };
    },
    getdowndy(state, action) {
      return {
        ...state,
        downdydata: action.payload,
      };
    },
    getdownother(state, action) {
      return {
        ...state,
        otherdata: action.payload,
      };
    },
    get102safezone(state, action) {
      return {
        ...state,
        zone102_2data: action.payload,
      };
    },
    get102down(state, action) {
      return {
        ...state,
        down102: action.payload,
      };
    },
    getupdy(state, action) {
      return {
        ...state,
        updydata: action.payload,
      };
    },
    getupother(state, action) {
      return {
        ...state,
        upotherdata: action.payload,
      };
    },
    getup102_2zone(state, action) {
      return {
        ...state,
        up102_2zonedata: action.payload,
      };
    },
    getsafe102_2zone(state, action) {
      return {
        ...state,
        safe102_2zonedata: action.payload,
      };
    },
    getsafe102zone(state, action) {
      return {
        ...state,
        up102safezone: action.payload,
      };
    },
  },
};

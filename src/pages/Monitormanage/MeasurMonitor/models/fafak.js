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

export default {
  namespace: 'fafak',

  state: {
    zone3data: [], // 3区KAFKA节点
    safezonedata: {}, // 安全接入区KAFKA节点
    zone2data: [], // 2区KAFKA节点
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
      yield put({
        type: 'clearcache'
      });
      const response = yield call(getKafka3Zone);
      yield put({
        type: 'get3zone',
        payload: response.data,
      });
    },
    *fetchsafezone({ payload }, { call, put }) {
      //  表格数据请求
      const response = yield call(getKafkaSafeZone, payload);
      yield put({
        type: 'getsafezone',
        payload: response.data,
        // payload: SafeZonedata,
      });
    },
    *fetch2zone({ payload }, { call, put }) {
      const response = yield call(getKafka2Zone, payload);
      yield put({
        type: 'get2zone',
        payload: response.data,
        // payload: SafeZonedata,
      });
    },
    *fetchdoendy(_, { call, put }) {
      const response = yield call(getdownDY);
      yield put({
        type: 'getdowndy',
        payload: response.data,
      });
    },
    *fetchdownother(_, { call, put }) {
      const response = yield call(getdownOther);
      yield put({
        type: 'getdownother',
        payload: response.data,
      });
    },
    *fetch102safezone(_, { call, put }) {
      const response = yield call(get102safeZone);
      yield put({
        type: 'get102safezone',
        payload: response.data,
      });
    },
    *fetch102down(_, { call, put }) {
      const response = yield call(get102Down);
      yield put({
        type: 'get102down',
        payload: response.data,
      });
    },
    *fetchupdy(_, { call, put }) {
      const response = yield call(getupDY);
      yield put({
        type: 'getupdy',
        payload: response.data,
      });
    },
    *fetchupother(_, { call, put }) {
      const response = yield call(getupOther);
      yield put({
        type: 'getupother',
        payload: response.data,
      });
    },
    *fetch102up2zone(_, { call, put }) {
      const response = yield call(get102up2Zone);
      yield put({
        type: 'getup102_2zone',
        payload: response.data,
      });
    },
    *fetch102safe2zone(_, { call, put }) {
      const response = yield call(get102upSafe2Zone);
      yield put({
        type: 'getsafe102_2zone',
        payload: response.data,
      });
    },
    *fetch102upsafezone(_, { call, put }) {
      const response = yield call(get102upSafeZone);
      yield put({
        type: 'getsafe102zone',
        payload: response.data,
      });
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        zone3data: [], // 3区KAFKA节点
        safezonedata: {}, // 安全接入区KAFKA节点
        zone2data: [], // 2区KAFKA节点
        downdydata: {}, // 下行主题低压相关
        otherdata: {}, // 其他回复接口（低压相关）
        zone102_2data: {}, //
        down102: {},
        updydata: {},
        upotherdata: {},
        up102_2zonedata: {},
        safe102_2zonedata: {},
        up102safezone: {},
      };
    },
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

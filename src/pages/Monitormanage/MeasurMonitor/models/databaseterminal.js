import Mock from 'mockjs'; // 引入mockjs
import {} from '../services/api';

const { Random } = Mock;
function Mockoperatingmode() {
  const list = [];
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    list.push({
      type: [
        '南宁',
        '柳州',
        '桂林',
        '贵港',
        '玉林',
        '梧州',
        '钦州',
        '北海',
        '防城港',
        '河池',
        '百色',
        '崇左',
      ][i % 12],
      // alert:[ true, false][i % 2],
      rate: Random.integer(60, 100),
    });
  }
  return list;
}

function Mockstoragecheck() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      name: '基准值曲线',
      clock: i % 24,
      alert: false,
      // alert:[ true, false][i % 2],
      value: Random.integer(60000, 80000),
    });
    list.push({
      name: '实际入库量曲线',
      clock: i % 24,
      alert: false,
      // alert:[ true, false][i % 2],
      value: Random.integer(60000, 80000),
    });
  }
  return list;
}

function Mockthehour() {
  const list = [];
  const count = 24;
  const date = new Date('2020-07-15 02:00:00');
  const size = 60 * 1000;
  const label = v => (v < 10 ? `0${v}` : v);
  for (let i = 0; i < count; i += 1) {
    const lableclock = `${label(date.getHours())}:${label(date.getMinutes())}`;
    list.push({
      name: '基准值曲线',
      // clock: date.setMinutes(date.getMinutes()+size),
      clock: `${label(date.getHours())}:${label(date.getMinutes())}`,
      alert: false,
      // alert:[ true, false][i % 2],
      value: Random.integer(60000, 80000),
    });
    list.push({
      name: '实际入库量曲线',
      clock: date.setMinutes(date.getMinutes() + 20),
      alert: false,
      // alert:[ true, false][i % 2],
      value: Random.integer(60000, 80000),
    });
  }
  return list;
}

export default {
  namespace: 'databaseterminal',

  state: {
    operatingmode: {},
    storagecheck: {},
    thehour: {},
    list: {},
  },

  effects: {
    *fetchoperat(_, { call, put }) {
      // const response = yield call(getKafka3Zone);
      const response = Mockoperatingmode();
      yield put({
        type: 'getoperat',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchstorge(_, { call, put }) {
      // const response = yield call(getKafkaSafeZone);
      const response = Mockstoragecheck();
      yield put({
        type: 'getstoragecheck',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchthehour(_, { call, put }) {
      // const response = yield call(getKafkaSafeZone);
      const response = Mockthehour();
      yield put({
        type: 'getthehour',
        // payload: response.data,
        payload: response,
      });
    },
    *fetchlist(_, { call, put }) {
      // const response = yield call(getKafka2Zone);
      yield put({
        type: 'getlistdata',
        // payload: response.data,
      });
    },
  },

  reducers: {
    getoperat(state, action) {
      return {
        ...state,
        operatingmode: action.payload,
      };
    },
    getstoragecheck(state, action) {
      return {
        ...state,
        storagecheck: action.payload,
      };
    },
    getthehour(state, action) {
      return {
        ...state,
        thehour: action.payload,
      };
    },
    getlistdata(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

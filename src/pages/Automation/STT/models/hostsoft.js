// import { queryHost, querySoft } from '../services/api';

const hostlist = [
  {
    id: 'host01',
    name: '计量检测服务',
    ip: '10.32.55.208',
    status: 0,
    softs: ['360', 'tomcat', 'RedisPlus', 'Postman'],
  },
  {
    id: 'host02',
    name: '电网服务',
    ip: '10.32.55.113',
    status: 1,
    softs: ['tomcat'],
  },
];
const softlist = [
  {
    id: 'soft01',
    name: '360',
    ip: 'V5.0',
    status: 0,
    softs: ['360', 'tomcat', 'RedisPlus', 'Postman'],
  },
];
export default {
  namespace: 'hostsoft',

  state: {
    hostdata: '',
    softdata: '',
  },

  effects: {
    *fetchhost(_, { call, put }) {
      // const response = yield call(queryHost);
      const response = hostlist;
      yield put({
        type: 'gethost',
        payload: response,
      });
    },
    *fetchsoft({ payload }, { call, put }) {
      // const response = yield call(querySoft, payload);
      yield put({
        type: 'getsoft',
        payload: response,
      });
    },
  },

  reducers: {
    gethost(state, action) {
      return {
        ...state,
        hostdata: action.payload,
      };
    },
    getsoft(state, action) {
      return {
        ...state,
        softdata: action.payload,
      };
    },
  },
};

// import { querylisthost, querylistdatabase, queryMonitorGroup } from '../services/monitorList';

import Mock from 'mockjs'; // 引入mockjs
import { querylisthost, querylistdatabase, queryMonitorGroup } from '../services/api';

const { Random } = Mock;

const mockmonitorGroups = {
  data: [
    {
      typeName: '主机',
      number: 560,
    },
    {
      typeName: '网络设备',
      number: 52,
    },
    {
      typeName: '中间件',
      number: 12,
    },
    {
      typeName: '数据库',
      number: 203,
    },
  ],
};
function Mockhostlist() {
  const list = [];
  const count = 20;
  for (let i = 0; i < count; i += 1) {
    list.push({
      type: ['CPU', '内存', '磁盘', 'WEB响应时间'][i % 4],
      expected: 100,
      name: Random.ip(),
      rate: Random.integer(50, 100),
    });
  }
  return list;
}
export default {
  namespace: 'monitorlist',

  state: {
    // current:'',
    data: [],
    // pageSize:'',
    // total:'',
    databaselist: [],
    monitorGroups: [],
    hosts: [],
  },

  effects: {
    *fetchhost(_, { call, put }) {
      const response = Mockhostlist();
      // const response = yield call(querylisthost, current, pageSize);
      yield put({
        type: 'save',
        // payload: response.data,
        payload: response,
      });
    },

    *fetchdatabase({ payload: { current, pageSize } }, { call, put }) {
      const response = yield call(querylistdatabase, current, pageSize);
      yield put({
        type: 'savedatabase',
        payload: response.data,
      });
    },

    *fetchMonitorGroup(_, { call, put }) {
      // const response = yield call(queryMonitorGroup);
      const response = mockmonitorGroups;
      yield put({
        type: 'addMonitorGroup',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        hosts: action.payload,
      };
    },
    savedatabase(state, { payload: { data, total, current } }) {
      return {
        ...state,
        databaselist: data,
        total,
        current,
      };
    },
    addMonitorGroup(state, { payload: data }) {
      return {
        ...state,
        monitorGroups: data,
      };
    },
  },
};

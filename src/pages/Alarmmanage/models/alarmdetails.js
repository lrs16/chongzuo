import router from 'umi/router';
import { message } from 'antd';
import { statusLog, hisWarnList } from '../services/api';

export default {
  namespace: 'alarmdetails',

  state: {
    statuslogs: undefined,
    historylists: undefined,
  },

  effects: {
    // 详情操作记录 statusLog
    *fetchstatusLog({ payload }, { call, put }) {
      // yield put({
      //   type: 'clearcache',
      // });
      const response = yield call(statusLog, payload);
      if (response.code === 200) {
        yield put({
          type: 'savestatuslog',
          payload: response.data,
        });
      }
    },
    *fetchhistroylist({ payload }, { call, put }) {
      const response = yield call(hisWarnList, payload);
      if (response.code === 200) {
        yield put({
          type: 'savehistory',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        statuslogs: undefined,
        historylists: undefined,
      };
    },
    savestatuslog(state, action) {
      return {
        ...state,
        statuslogs: action.payload || [],
      };
    },
    savehistory(state, action) {
      return {
        ...state,
        historylists: action.payload || [],
      };
    },
  },
};

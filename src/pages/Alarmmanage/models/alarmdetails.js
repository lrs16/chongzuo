import router from 'umi/router';
import { message } from 'antd';
import { statusLog, hisWarnList, getSms } from '../services/api';

export default {
  namespace: 'alarmdetails',

  state: {
    statuslogs: undefined,
    historylists: undefined,
    smslist: undefined,
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
    *fetchsms({ payload }, { call, put }) {
      const response = yield call(getSms, payload);
      if (response.code === 200) {
        yield put({
          type: 'savesms',
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
    savesms(state, action) {
      return {
        ...state,
        smslist: action.payload || [],
      };
    },
  },
};

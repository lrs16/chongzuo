import { 
         queryDetail,
         queryDetailBasic, 
         queryOperats,
         alarmList 
  } from '../services/api';

export default {
  namespace: 'alarmdetails',

  state: {
    list: [],
    operatslist: [],
    alarmList:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchbasic({ payload }, { call, put }) {
      const response = yield call(queryDetailBasic, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *fetchoperats({ payload }, { call, put }) {
      const response = yield call(queryOperats, payload);
      yield put({
        type: 'getoperats',
        payload: response,
      });
    },
    //  告警信息明细的列表
    *alarmList({ payload }, { call, put }) {
      const response = yield call(alarmList,payload);
      yield put({
        type:'alarmList',
        payload:response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getoperats(state, action) {
      return {
        ...state,
        operatslist: action.payload,
      };
    },

    alarmList(state, action) {
      return {
        ...state,
        alarmList:action.payload,
      }
    },
  },
};

import { message } from 'antd';
import {
  // queryAlarmList,
  configStatus,        // 确认告警
  AlarmoverDonut,
  AlarmoverSmooth,
  statisticsItems,     // 统计信息
  warmBizList,         // 列表
  bizlistStatistics,   // 列表页签
  updateClearStatus,
} from '../services/api';

export default {
  namespace: 'measuralarm',

  state: {
    list: {},
    Donutdata: [],
    Smoothdata: [],
    totalinfo: undefined,
    searchtab: [],
  },

  effects: {
    // 告警概览：列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(warmBizList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchtotalinfo({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(statisticsItems, payload);
      yield put({
        type: 'savetotal',
        payload: response.data?.statisticsItems,
      });
    },
    // 查询tab
    *fetchsearchtab({ payload }, { call, put }) {
      const response = yield call(bizlistStatistics, payload);
      yield put({
        type: 'savesearchtab',
        payload: response.data,
      });
    },
    // 告警概览：饼图
    *fetchoverdonut({ payload: { key } }, { call, put }) {
      const response = yield call(AlarmoverDonut, key);
      yield put({
        type: 'savedonut',
        payload: response.data,
      });
    },
    // 告警概览：曲线
    *fetchoversmooth({ payload: { key } }, { call, put }) {
      const response = yield call(AlarmoverSmooth, key);
      yield put({
        type: 'savesmooth',
        payload: response.data,
      });
    },
    // 修改确认告警状态
    *alarmsconfig({ payload: { configval, values } }, { call, put }) {
      const response = yield call(configStatus, configval);
      if (response.code === 200) {
        message.success('操作成功！')
        const reslist = yield call(warmBizList, values);
        yield put({
          type: 'save',
          payload: reslist.data,
        });
      } else {
        message.error('操作失败！')
      }
    },
    // 消除告警
    *clearconfig({ payload: { configval, values } }, { call, put }) {
      const response = yield call(updateClearStatus, configval);
      if (response.code === 200) {
        message.success('操作成功！')
        const reslist = yield call(warmBizList, values);
        yield put({
          type: 'save',
          payload: reslist.data,
        });
      } else {
        message.error('操作失败！')
      }
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
        Donutdata: [],
        Smoothdata: [],
        totalinfo: undefined,
        searchtab: [],
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload || {},
      };
    },
    savetotal(state, action) {
      return {
        ...state,
        totalinfo: action.payload || [],
      };
    },
    savesearchtab(state, action) {
      return {
        ...state,
        searchtab: action.payload || [],
      };
    },
    savedonut(state, action) {
      return {
        ...state,
        Donutdata: action.payload,
      };
    },
    savesmooth(state, action) {
      return {
        ...state,
        Smoothdata: action.payload,
      };
    },
  },
};

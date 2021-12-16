import { message } from 'antd';
import {
  analysisSummary,
  taskStatistical,
  unitStatistical,
  typeStatistical,
  timeOutOrder,
  timeOutTask,
  unitTimeOut,
  assigneeTimeOut,
  abilityTimeOut,
  summaryDetail,
  taskStatisticalDetail,
  unitStatisticalDetail,
  typeStatisticalDetail,
  timeOutOrderDetail,
  abilityTimeOutDetail,
  timeOutTaskDetail,
  unitTimeOutDetail,
  assigneeTimeOutDetail
} from '../services/api';

export default {
  namespace: 'releaseanalysis',

  state: {
    analysis: {},
    unitdata: {},
    timeoutdata: {},
    ability: {},
    list: {}
  },

  effects: {
    // 列表
    *fetchsum({ payload }, { call, put }) {
      const summaryres = yield call(analysisSummary, payload);
      const platres = yield call(taskStatistical, { ...payload, taskName: '平台验证' });
      const bizres = yield call(taskStatistical, { ...payload, taskName: '业务验证' });
      const doneres = yield call(taskStatistical, { ...payload, taskName: '发布验证' });
      const bizcheckres = yield call(taskStatistical, { ...payload, taskName: '业务复核' });
      yield put({
        type: 'save',
        payload: {
          summary: summaryres.data,
          platsum: platres.data,
          bizsum: bizres.data,
          donesum: doneres.data,
          bizchecksum: bizcheckres.data,
        },
      });
    },
    *fetchunit({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const unitres = yield call(unitStatistical, payload);
      const typeres = yield call(typeStatistical, payload);
      yield put({
        type: 'saveunit',
        payload: {
          unitanalysis: unitres.data,
          typeanalysis: typeres.data,
        },
      });
    },
    *fetchtimeout({ payload }, { call, put }) {
      const orderres = yield call(timeOutOrder, payload);
      const taskres = yield call(timeOutTask, payload);
      const unitres = yield call(unitTimeOut, payload);
      const assigneeres = yield call(assigneeTimeOut, payload);
      yield put({
        type: 'savetimeout',
        payload: {
          orederanalysis: orderres.data,
          taskanalysis: taskres.data,
          unittimeout: unitres.data,
          assigneetimeout: assigneeres.data,
        },
      });
    },
    *fetchability({ payload }, { call, put }) {
      const allres = yield call(abilityTimeOut, { ...payload, ability: 'all' });
      const frontres = yield call(abilityTimeOut, { ...payload, ability: 'front' });
      const backres = yield call(abilityTimeOut, { ...payload, ability: 'back' });
      yield put({
        type: 'saveability',
        payload: {
          allability: allres.data,
          frontability: frontres.data,
          backability: backres.data,
        },
      });
    },
    *fetchlist({
      payload: { val, name, type, taskName, item, unit, releaseType, timeout, ability, subAbility, userName }
    }, { call, put }) {
      yield put({
        type: 'clearlist'
      });
      let response = {}
      switch (type) {
        case 'summary':
          response = yield call(summaryDetail, { ...val, item: name });
          break;
        case 'taskStatistical':
          response = yield call(taskStatisticalDetail, { ...val, taskName, item });
          break;
        case 'unitStatistical':
          response = yield call(unitStatisticalDetail, { ...val, unit });
          break;
        case 'typeStatistical':
          response = yield call(typeStatisticalDetail, { ...val, releaseType });
          break;
        case 'timeOutOrder':
          response = yield call(timeOutOrderDetail, { ...val, timeout });
          break;
        case 'abilityTimeOut':
          response = yield call(abilityTimeOutDetail, { ...val, ability, subAbility });
          break;
        case 'timeOutTask':
          response = yield call(timeOutTaskDetail, { ...val, ability, taskName });
          break;
        case 'unitTimeOut':
          response = yield call(unitTimeOutDetail, { ...val, unit });
          break;
        case 'assigneeTimeOut':
          response = yield call(assigneeTimeOutDetail, { ...val, userName });
          break;
        default:
          break;
      };
      if (response.code === 200) {
        yield put({
          type: 'savelist',
          payload: {
            list: response.data,
          },
        });
      }
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        unitdata: {},
      };
    },
    save(state, action) {
      return {
        ...state,
        analysis: action.payload,
      };
    },
    saveunit(state, action) {
      return {
        ...state,
        unitdata: action.payload,
      };
    },
    savetimeout(state, action) {
      return {
        ...state,
        timeoutdata: action.payload,
      };
    },
    saveability(state, action) {
      return {
        ...state,
        ability: action.payload,
      };
    },
    clearlist(state) {
      return {
        ...state,
        list: {},
      };
    },
    savelist(state, action) {
      return {
        ...state,
        list: action.payload.list,
      };
    },
  },
};

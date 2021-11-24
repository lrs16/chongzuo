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
  abilityTimeOut
} from '../services/api';

export default {
  namespace: 'releaseanalysis',

  state: {
    analysis: {},
    unitdata: {},
    timeoutdata: {},
    ability: {},
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
  },
};

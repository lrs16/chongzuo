import { message } from 'antd';
import { analysisSummary, taskStatistical, unitStatistical } from '../services/api';

export default {
  namespace: 'releaseanalysis',

  state: {
    analysis: {},
  },

  effects: {
    // 列表
    *fetchanalysis({ payload }, { call, put }) {
      const summaryres = yield call(analysisSummary, payload);
      const platres = yield call(taskStatistical, { ...payload, taskName: '平台验证' });
      const bizres = yield call(taskStatistical, { ...payload, taskName: '业务验证' });
      const doneres = yield call(taskStatistical, { ...payload, taskName: '发布实施' });
      const bizcheckres = yield call(taskStatistical, { ...payload, taskName: '业务复核' });
      const unitres = yield call(unitStatistical, payload);
      yield put({
        type: 'save',
        payload: {
          summary: summaryres.data,
          platsum: platres.data,
          bizsum: bizres.data,
          donesum: doneres.data,
          bizchecksum: bizcheckres.data,
          unitsum: unitres.data
        },
      });
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        analysis: undefined,
      };
    },
    save(state, action) {
      return {
        ...state,
        analysis: action.payload,
      };
    },

  },
};

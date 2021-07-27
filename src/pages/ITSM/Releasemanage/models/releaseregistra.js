import { saveRegister } from '../services/api';

export default {
  namespace: 'releaseregistra',

  state: {

  },

  effects: {
    // 列表
    *saveorsubmit({ payload: { taskId, type, buttontype } }, { call, put }) {
      const response = yield call(saveRegister, taskId, type);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

  },

  reducers: {

  },
};

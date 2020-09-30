import { mainplayList, mainplaySave } from '../services/maintenPlan';

export default {
  namespace: 'maintenanceplan',

  state: {
    list: [],
  },

  effects: {
    *mainplayList({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(mainplayList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *mainplaySave({ payload }, { call }) {
      return yield call(mainplaySave, payload);
    },
  },

  reducers: {
    show(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

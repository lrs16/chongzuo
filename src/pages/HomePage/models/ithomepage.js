import { TroubleTabs, EventTabs, ProblemTabs, EventAssingned, DemandTabs } from '../services/itapi';

export default {
  namespace: 'ithomepage',

  state: {
    list: [],
  },

  effects: {
    // 事件列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(EventAssingned, { ...payload });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 事件tab
    *geteventtabs({ payload }, { call }) {
      return yield call(EventTabs, payload);
    },
    // 故障tab
    *gettroubletabs({ payload }, { call }) {
      return yield call(TroubleTabs, payload);
    },
    // 问题tab
    *getproblemtabs({ payload }, { call }) {
      return yield call(ProblemTabs, payload);
    },
    // 需求tab
    *getdemandtabs({ payload: { userId } }, { call }) {
      return yield call(DemandTabs, userId);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

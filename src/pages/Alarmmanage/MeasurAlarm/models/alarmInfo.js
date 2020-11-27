import { infoGrouplist,
         contactSettingslist
         } from '../services/api';

export default {
  namespace:'alarminfo',

  state:{
    notifiGroup: [],
    settingList:[]
  },

  effects: {
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(infoGrouplist, payload);
      yield put ({
        type:'notifiGroup',
        payload: response
      });
    },

    *fetchsettingList({ payload }, { call, put }) {
      const response = yield call (contactSettingslist, payload);
      yield put ({
        type:'settingList',
        payload: response
      });
    }

  },

  reducers: {
    notifiGroup(state, action) {
      return {
        ...state,
        notifiGroup: action.payload
      }
    },
    settingList(state, action) {
      return {
        ...state,
        settingList: action.payload
      }
    }

  }
}
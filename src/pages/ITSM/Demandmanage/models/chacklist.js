import router from 'umi/router';
import { message } from 'antd';
import { TracksList, TrackUpdata, TrackDelete } from '../services/api';

export default {
  namespace: 'chacklist',

  state: {
    trackslist: [],
  },

  effects: {
    // 需求跟踪查询
    *fetchtracklist({ payload: { demandId } }, { call, put }) {
      const response = yield call(TracksList, demandId);
      yield put({
        type: 'savetracks',
        payload: response.data,
      });
    },
    // 系统开发商处理保存
    *tracksave({ payload }, { call }) {
      console.log(payload);
      return yield call(TrackUpdata, payload);
    },
    // 需求跟踪删除
    *trackdelete({ payload: { id } }, { call }) {
      return yield call(TrackDelete, id);
    },
  },

  reducers: {
    savetracks(state, action) {
      return {
        ...state,
        trackslist: action.payload,
      };
    },
  },
};

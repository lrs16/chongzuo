import router from 'umi/router';
import { message } from 'antd';
import {
  DemandtoDoList,
  DemandRecords,
  DemandImage,
  DemandOpenFlow,
  registerSaveOrUpdate,
  DemandSaveOrUpdate,
  NextStep,
  TracksList,
  TrackUpdata,
  TrackDelete,
  DemandgoBack,
} from '../services/api';

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
    *tracksave({ payload }, { call, put }) {
      const response = yield call(TrackUpdata, payload);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const openres = yield call(TracksList, payload.demandId);
        yield put({
          type: 'savetracklist',
          payload: openres.data,
        });
      }
    },
    // 需求跟踪删除
    *trackdelete({ payload: { id, demandId } }, { call, put }) {
      const response = yield call(TrackDelete, id);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const reslist = yield call(TracksList, demandId);
        yield put({
          type: 'savetracklist',
          payload: reslist.data,
        });
      }
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

import router from 'umi/router';
import { message } from 'antd';
import { DemandtoDoList, DemandRecords, DemandImage } from '../services/api';

export default {
  namespace: 'demandtodo',

  state: {
    list: [],
    imgblob: '',
    records: '',
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(DemandtoDoList, { ...payload });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    // 编辑流转记录/itsm/event/form/getTaskByProcessId?processId=
    *demandrecords({ payload: { processId } }, { call, put }) {
      const response = yield call(DemandRecords, processId);
      yield put({
        type: 'saverecords',
        payload: response.data,
      });
    },
    // 流程图
    *demandimage({ payload: { processId } }, { call, put }) {
      const response = yield call(DemandImage, processId);
      yield put({
        type: 'saveimg',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saverecords(state, action) {
      return {
        ...state,
        records: action.payload,
      };
    },
    saveimg(state, action) {
      return {
        ...state,
        imgblob: action.payload,
      };
    },
  },
};

import router from 'umi/router';
import { message } from 'antd';
import {
  DemandtoDoList,
  DemandRecords,
  DemandImage,
  DemandOpenFlow,
  registerSaveOrUpdate,
} from '../services/api';

export default {
  namespace: 'demandtodo',

  state: {
    list: [],
    imgblob: '',
    records: '',
    info: '',
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
    // 打开编辑
    *demandopenflow({ payload: { processInstanceId } }, { call, put }) {
      const response = yield call(DemandOpenFlow, processInstanceId);
      yield put({
        type: 'saveinfo',
        payload: response.data,
      });
    },
    // 登记编辑保存
    *demandregisterupdate({ payload: { paloadvalues, processInstanceId } }, { call, put }) {
      const response = yield call(registerSaveOrUpdate, paloadvalues);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const resopen = yield call(DemandOpenFlow, processInstanceId);
        yield put({
          type: 'saveinfo',
          payload: resopen.data,
        });
      }
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
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};

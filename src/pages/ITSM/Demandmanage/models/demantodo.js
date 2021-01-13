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
  TrackList,
  TrackUpdata,
  TrackDelete,
} from '../services/api';

export default {
  namespace: 'demandtodo',

  state: {
    list: [],
    imgblob: '',
    records: '',
    info: '',
    tracklist: '',
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
    // 编辑通用流转
    *demandnextstep({ payload }, { call }) {
      const response = yield call(NextStep, payload);
      if (response.code === 200) {
        message.success(response.msg, 2);
        router.push({
          pathname: `/ITSM/demandmanage/to-do`,
        });
      }
    },
    // 编辑通用保存
    *demandsave({ payload }, { call }) {
      const response = yield call(DemandSaveOrUpdate, payload);
      if (response.code === 200) {
        message.success(response.msg, 2);
      }
    },
    // 需求跟踪查询
    *fetchtracklist({ payload: { demandId } }, { call, put }) {
      const response = yield call(TrackList, demandId);
      yield put({
        type: 'savetracklist',
        payload: response.data,
      });
    },
    // 需求跟踪保存
    *tracksave({ payload }, { call }) {
      const response = yield call(TrackUpdata, payload);
      if (response.code === 200) {
        message.success(response.msg, 2);
      }
    },
    // 需求跟踪删除
    *trackdelete({ payload: { id, demandId } }, { call, put }) {
      const response = yield call(TrackDelete, id);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const reslist = yield call(TrackList, demandId);
        yield put({
          type: 'savetracklist',
          payload: reslist.data,
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
    savetracklist(state, action) {
      return {
        ...state,
        tracklist: action.payload,
      };
    },
  },
};

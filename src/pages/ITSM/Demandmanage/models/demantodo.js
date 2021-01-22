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
  DemandgoBack,
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
    *demandopenflow({ payload: { processInstanceId, taskId } }, { call, put }) {
      const response = yield call(DemandOpenFlow, processInstanceId, taskId);
      yield put({
        type: 'saveinfo',
        payload: response.data,
      });
    },
    // 登记编辑保存
    *demandregisterupdate({ payload: { paloadvalues, processInstanceId, taskId } }, { call, put }) {
      const response = yield call(registerSaveOrUpdate, paloadvalues);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const resopen = yield call(DemandOpenFlow, processInstanceId, taskId);
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
    *demandsave({ payload: { paloadvalues, processInstanceId, taskId } }, { call, put }) {
      const response = yield call(DemandSaveOrUpdate, paloadvalues);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const openres = yield call(DemandOpenFlow, processInstanceId, taskId);
        yield put({
          type: 'saveinfo',
          payload: openres.data,
        });
      }
    },
    // 编辑回退
    *demanback({ payload }, { call }) {
      const resmsg = yield call(DemandgoBack, payload);
      if (resmsg.code === 200) {
        message.success(resmsg.msg, 3);
        router.push({
          pathname: `/ITSM/demandmanage/to-do`,
        });
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
    // 系统开发商处理
    *tracksave({ payload }, { call, put }) {
      const response = yield call(TrackUpdata, payload);
      if (response.code === 200) {
        message.success(response.msg, 2);
        const openres = yield call(TrackList, payload.demandId);
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

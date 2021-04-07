import router from 'umi/router';
import { message } from 'antd';
import {
  EventgetAllTask,
  EventopenFlow,
  EventSaveFlow,
  EventFlow,
  EventRecords,
  saveFallbackMsg,
  EventDelete,
  EventImage,
  querydownload,
  querydownloadbyids
} from '../services/api';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/handle_/g, 'handle.')
      .replace(/register_/g, 'register.')
      .replace(/check_/g, 'check.')
      .replace(/finish_/g, 'finish.'),
  );
  return newarr;
};

export default {
  namespace: 'eventtodo',

  state: {
    list: [],
    info: '',
    records: '',
    imgblob: '',
    download: '',
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(EventgetAllTask, { ...payload });
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 打开编辑
    *eventopenflow({ payload: { taskId } }, { call, put }) {
      const response = yield call(EventopenFlow, taskId);
      if (response.code === -1) {
        message.error(response.msg, 2);
        router.push({
          pathname: `/ITSM/eventmanage/to-do`,
        });
      }
      yield put({
        type: 'saveinfo',
        payload: response,
      });
    },
    // 编辑保存
    *eventsave({ payload: { paloadvalues, flowInstanceId } }, { call, put }) {
      const values = replacerec({ ...paloadvalues, flowInstanceId });
      const registres = yield call(EventSaveFlow, values);
      if (registres.code === -1) {
        message.error(registres.msg, 3);
      }
      if (registres.code === 200) {
        const { taskId, eventStatus } = registres;
        message.success('保存成功', 3);
        // 保存成功重新加载
        const response = yield call(EventopenFlow, taskId);
        router.push({
          pathname: `/ITSM/eventmanage/to-do/record/workorder`,
          query: {
            taskName: eventStatus,
            taskId: registres.taskId,
            mainId: flowInstanceId,
          },
        });
        yield put({
          type: 'saveinfo',
          payload: response,
        });
      }
    },
    // 编辑流转,流转成功转回待办列表,转单，
    *eventflow({ payload: { flow, paloadvalues } }, { call }) {
      const values = replacerec({ ...paloadvalues });
      const registres = yield call(EventSaveFlow, values);
      if (registres.code === 200) {
        const flowpayload = {
          ...flow,
          id: registres.taskId,
        };
        const response = yield call(EventFlow, flowpayload);
        if (response.code === 200) {
          message.success(response.msg, 3);
          router.push({
            pathname: `/ITSM/eventmanage/to-do`,
          });
        }
      }
    },
    // 结束流程
    *overflow({ payload: { flow, paloadvalues } }, { call }) {
      const values = replacerec({ ...paloadvalues });
      const registres = yield call(EventSaveFlow, values);
      if (registres.code === 200) {
        const response = yield call(EventFlow, flow);
        if (response.code === 200) {
          message.success(response.msg, 3);
          router.push({
            pathname: `/ITSM/eventmanage/to-do`,
          });
        }
      }
    },

    // 编辑回退
    *eventback({ payload }, { call }) {
      const { msg } = payload;
      const taskId = payload.id;
      const resmsg = yield call(saveFallbackMsg, msg, taskId);
      if (resmsg.code === 200) {
        const response = yield call(EventFlow, payload);
        if (response.code === 200) {
          message.success(response.msg, 3);
          router.push({
            pathname: `/ITSM/eventmanage/to-do`,
          });
        }
      }
    },

    // 编辑接单
    *eventaccept({ payload }, { call, put }) {
      const response = yield call(EventFlow, payload);
      if (response.code === 200) {
        message.success(response.msg, 3);
        const taskId = response.flowNodeInstanceId;
        const openres = yield call(EventopenFlow, taskId);
        yield put({
          type: 'saveinfo',
          payload: openres,
        });
        router.push({
          pathname: `/ITSM/eventmanage/to-do/record/workorder`,
          query: {
            taskName: '处理中',
            taskId,
            mainId: response.flowInstanceId,
            next: sessionStorage.getItem('Nextflowmane'),
          },
        });
      }
    },
    // 删除
    *deleteflow({ payload }, { call }) {
      const response = yield call(EventDelete, payload);
      if (response.code === -1) {
        message.error(response.msg, 3);
      }
      if (response.code === 200) {
        message.success(response.msg, 3);
        router.push({
          pathname: `/ITSM/eventmanage/to-do`,
        });
      }
    },

    // 编辑流转记录/itsm/event/form/getTaskByProcessId?processId=
    *eventrecords({ payload: { processId } }, { call, put }) {
      const response = yield call(EventRecords, processId);
      yield put({
        type: 'saverecords',
        payload: response.data,
      });
    },
    // 流程图
    *eventimage({ payload: { processInstanceId } }, { call, put }) {
      const response = yield call(EventImage, processInstanceId);
      yield put({
        type: 'saveimg',
        payload: response,
      });
    },
    // 下载
    *eventdownload({ payload: { values, ids } }, { call }) {
      if (ids.length === 0) {
        return yield call(querydownload, { ...values });
      }
      return yield call(querydownloadbyids, ids);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload,
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
        imgblob: action.payload || '',
      };
    },
  },
};

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
} from '../services/api';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/handle_/g, 'handle.')
      .replace(/handle.handle./g, 'handle.handle_')
      .replace(/handle.user/g, 'handle.handler')
      .replace(/register_/g, 'register.')
      .replace(/register.register./g, 'register.register_')
      .replace(/check_/g, 'check.')
      .replace(/check.check./g, 'check.check_')
      .replace(/finish_/g, 'finish.')
      .replace(/finish.finish./g, 'finish.finish_'),
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
      yield put({
        type: 'saveinfo',
        payload: response,
      });
    },
    // 编辑保存
    *eventsave({ payload: { paloadvalues, pangekey, flow_instance_id } }, { call, put }) {
      const values = replacerec({ ...paloadvalues });
      console.log(values);
      const { register_selfhandle } = values;
      const registres = yield call(EventSaveFlow, values);
      if (registres.code === 200) {
        const { taskId } = registres;
        message.success(registres.msg, 5);
        if (register_selfhandle === '1') {
          router.push({
            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
            query: {
              pangekey: '5',
              id: registres.taskId,
              mainId: flow_instance_id,
              validate: false,
            },
          });
        } else {
          router.push({
            pathname: `/ITSM/eventmanage/to-do/record/workorder`,
            query: {
              pangekey,
              id: registres.taskId,
              mainId: flow_instance_id,
              validate: false,
            },
          });
        }
        // 保存成功重新加载
        const response = yield call(EventopenFlow, taskId);
        yield put({
          type: 'saveinfo',
          payload: response,
        });
      }
    },
    // 编辑流转,流转成功转回待办列表
    *eventflow({ payload: { flow, paloadvalues } }, { call }) {
      const values = replacerec({ ...paloadvalues });
      console.log(values);
      const registres = yield call(EventSaveFlow, values);
      if (registres.code === 200) {
        const response = yield call(EventFlow, flow);
        if (response.code === 200) {
          message.success(response.msg, 5);
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
          message.success(response.msg, 5);
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
        message.success(response.msg, 5);
        const taskId = response.flow_node_instance_id;
        const openres = yield call(EventopenFlow, taskId);
        yield put({
          type: 'saveinfo',
          payload: openres,
        });
        router.push({
          pathname: `/ITSM/eventmanage/to-do/record/workorder`,
          query: {
            pangekey: '5',
            id: taskId,
            mainId: response.flow_instance_id,
            validate: false,
          },
        });
      }
    },
    // 删除
    *deleteflow({ payload }, { call }) {
      const response = yield call(EventDelete, payload);
      if (response.code === 200) {
        message.success(response.msg, 5);
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
    //下载
    *eventdownload(_, { call }) {
      return yield call(querydownload);
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

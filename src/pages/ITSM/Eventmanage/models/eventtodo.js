import router from 'umi/router';
import { message } from 'antd';
import { EventgetAllTask, EventopenFlow, EventSaveFlow } from '../services/api';

export default {
  namespace: 'eventtodo',

  state: {
    list: [],
    info: '',
  },

  effects: {
    // 列表
    *fetchlist(_, { call, put }) {
      const response = yield call(EventgetAllTask);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *eventflow({ payload: { taskId } }, { call, put }) {
      const response = yield call(EventopenFlow, taskId);
      yield put({
        type: 'saveinfo',
        payload: response,
      });
    },
    *eventsave({ payload }, { call, put }) {
      console.log(payload);
      // const registres = yield call(EventSaveFlow, payload);
      // if (registres.code === 200) {
      //   message.success(registres.msg, 5);
      //   router.push({
      //     pathname: `/ITSM/eventmanage/to-do/record/workorder`,
      //     query: {
      //       pangekey: '已登记',
      //       id: registres.taskId,
      //       validate: false,
      //     },
      //   });
      // }
      // yield put({
      //   type: 'saveinfo',
      //   payload: response.data,
      // });
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
  },
};

import router from 'umi/router';
import { message } from 'antd';
import {
  ITSMUser,
  EventFlowUserList,
  DemandFlowUserList,
  TroubleFlowUserList,
  ProblemFlowUserList,
} from '@/services/user';

export default {
  namespace: 'itsmuser',
  state: {
    flowmsg: '',
    userinfo: '',
    userlist: '',
  },

  effects: {
    // 打开登记，加载用户信息
    *fetchuser(_, { call, put }) {
      const response = yield call(ITSMUser);
      yield put({
        type: 'saveuser',
        payload: response.data,
      });
    },
    // 加载事件下一环节处理人列表
    *eventuserlist({ payload: { taskId, type } }, { call, put }) {
      const response = yield call(EventFlowUserList, taskId, type);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
    // 加载需求下一环节处理人列表
    *demanduserlist({ payload: { taskId, type } }, { call, put }) {
      const response = yield call(DemandFlowUserList, taskId, type);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
    // 加载故障下一环节处理人列表
<<<<<<< HEAD
    *troubleuserlist({ payload: { taskId, result } }, { call, put }) {
      const response = yield call(TroubleFlowUserList, taskId, result);
=======
    *troubleuserlist({ payload: { taskId, type } }, { call, put }) {
      const response = yield call(TroubleFlowUserList, taskId, type);
>>>>>>> 465151b... 更新问题管理代码
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
    // 加载问题下一环节处理人列表
<<<<<<< HEAD
    *problemuserlist({ payload: { taskId, result } }, { call, put }) {
      const response = yield call(ProblemFlowUserList, taskId, result);
=======
    *problemuserlist({ payload: { taskId, type } }, { call, put }) {
      const response = yield call(ProblemFlowUserList, taskId, type);
>>>>>>> 465151b... 更新问题管理代码
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveuser(state, action) {
      return {
        ...state,
        userinfo: action.payload,
      };
    },

    savelist(state, action) {
      return {
        ...state,
        userlist: action.payload,
      };
    },
  },
};

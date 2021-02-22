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
    problemlist:''
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
    *demanduserlist({ payload: { taskId, result } }, { call, put }) {
      const response = yield call(DemandFlowUserList, taskId, result);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
    // 加载故障下一环节处理人列表
    *troubleuserlist({ payload: { taskId, result } }, { call, put }) {
      const response = yield call(TroubleFlowUserList, taskId, result);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
    // 加载问题下一环节处理人列表
    *problemuserlist({ payload: { taskId, result } }, { call, put }) {
      const response = yield call(ProblemFlowUserList, taskId, result);
      yield put({
        type: 'problemlist',
        payload: response,
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

    problemlist(state, action) {
      return {
        ...state,
        problemlist: action.payload,
      };
    },
  },
};

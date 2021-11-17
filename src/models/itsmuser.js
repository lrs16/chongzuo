import router from 'umi/router';
import { message } from 'antd';
import {
  ITSMUser,
  EventFlowUserList,
  DemandFlowUserList,
  TroubleFlowUserList,
  ProblemFlowUserList,
  taskFlowUserList,
  releaseUserList,
  achievementsNextTaskUser
} from '@/services/user';

export default {
  namespace: 'itsmuser',
  state: {
    flowmsg: '',
    userinfo: '',
    userlist: '',
    problemlist: '',
    tasklist: '',
    achievementlist: '',
    describe: '',
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
    // 周报查询页解决异步影响
    *fetchuserids(_, { call, put }) {
      return yield call(ITSMUser);
    },
    // 加载事件下一环节处理人列表
    *eventuserlist({ payload: { taskId, type } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(EventFlowUserList, taskId, type);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },
    // 加载需求下一环节处理人列表
    *demanduserlist({ payload: { taskId, result } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
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
    // 加载送审人列表
    *taskuserlist({ payload }, { call, put }) {
      const response = yield call(taskFlowUserList);
      yield put({
        type: 'savelist',
        payload: response.data,
      });
    },

    // 加载发布下一环节处理人
    *releaseuserlist({ payload: { taskId, type } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(releaseUserList, taskId, type);
      yield put({
        type: 'savereleaselist',
        payload: { userlist: response.data.userList, describe: response.data.describe },
      });
    },
    // 加载绩效下一环节处理人
    *achievementsNextTaskUser({ payload: { taskId, type } }, { call, put }) {
      const response = yield call(achievementsNextTaskUser, taskId, type);
      yield put({
        type: 'achievementlist',
        payload: response.data,
      });
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        userlist: '',
        describe: '',
      };
    },
    saveuser(state, action) {
      return {
        ...state,
        userinfo: action.payload,
        describe: '',
      };
    },

    savelist(state, action) {
      return {
        ...state,
        userlist: action.payload,
        describe: '',
      };
    },

    problemlist(state, action) {
      return {
        ...state,
        problemlist: action.payload,
        describe: '',
      };
    },

    tasklist(state, action) {
      return {
        ...state,
        tasklist: action.payload,
        describe: '',
      };
    },

    achievementlist(state, action) {
      return {
        ...state,
        userlist: action.payload,
        describe: '',
      };
    },

    savereleaselist(state, action) {
      return {
        ...state,
        userlist: action.payload.userlist,
        describe: action.payload.describe,
      };
    },
  },
};

import { message } from 'antd';
import {
  querySeceneList,
  querySeceneScript,
  execuSecene,
  querySecenejoblist,
  querySecenereport,
  removeSeceneList,
  addSeceneList,
  updateSeceneList,
} from '../services/apisecene';

export default {
  namespace: 'opsscenes',

  state: {
    list: [],
    scriptlist: [],
    joblist: [],
    reporturl: '',
  },

  effects: {
    // 请求运维场景
    *fetch({ payload: { limit, pages } }, { call, put }) {
      const response = yield call(querySeceneList, limit, pages);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    // 根据运维场景中的ID请求场景中在执行的脚本
    *fetchscript({ payload: { id } }, { call, put }) {
      const response = yield call(querySeceneScript, id);
      yield put({
        type: 'queryScript',
        payload: response,
      });
    },
    // 根据运维场景中在执行脚本的xxlJobId请求该脚本的执行历史
    *fetchjoblist({ payload: { jobId } }, { call, put }) {
      const response = yield call(querySecenejoblist, jobId);
      yield put({
        type: 'queryjoblist',
        payload: response,
      });
    },
    // 下载报告
    *download({ payload: { logId } }, { call }) {
      return yield call(querySecenereport, logId);
      // if (response instanceof Blob) {
      //     if (callback && typeof callback === 'function') {
      //           callback(response);
      //     }
      // } else {
      //     message.warning('下载失败', 5);
      // }
    },

    *execution({ payload: { scenarioId } }, { call }) {
      return yield call(execuSecene, scenarioId);
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(querySeceneList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeSeceneList : updateSeceneList;
      } else {
        callback = addSeceneList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload.data.content,
      };
    },
    queryScript(state, action) {
      return {
        ...state,
        scriptlist: action.payload.data.content,
      };
    },
    queryjoblist(state, action) {
      return {
        ...state,
        joblist: action.payload.data.data,
      };
    },
    getReport(state, action) {
      return {
        ...state,
        reporturl: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

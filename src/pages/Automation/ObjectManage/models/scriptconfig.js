import {
  // 系统脚本
  SystemScriptList,
  systemscriptaddOrEdit, // 添加编辑（保存）
  systemscriptSubmit, // 提交
  deletesystemScript,
  recellScript,
  // 本地脚本
  localScriptList,
  localscriptadd,
  localscriptedit,
  deletelocalScript,

} from '../services/api';

export default {
  namespace: 'scriptconfig',

  state: {
    systemscriptlist: {},
    localscriptlist: {},
  },

  effects: {
    // 系统脚本
    // 获取脚本配置系统脚本列表
    *findSystemScriptList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(SystemScriptList, values, pageNum, pageSize);
      // yield put({
      //     type: 'clearcache',
      // });
      yield put({
        type: 'savesystemscriptlist',
        payload: response.data,
      });
    },

    // 添加编辑（保存）
    *toupdatesystemScript({ payload }, { call }) {
      return yield call(systemscriptaddOrEdit, payload);
    },

    // 提交
    *tosubmitsystemScript({ payload }, { call }) {
      return yield call(systemscriptSubmit, payload);
    },

    // 删除系统脚本列表数据
    *toDeletesystemScript({ payload }, { call }) {
      return yield call(deletesystemScript, payload);
    },

    // 撤回
    *torecellScript({ payload: { Ids } }, { call }) {
      return yield call(recellScript, Ids);
    },

    // 本地脚本
    // 获取脚本配置本地脚本列表
    *findLocalScriptList({ payload: { values, pageNum, pageSize } }, { call, put }) {
      const response = yield call(localScriptList, values, pageNum, pageSize);
      // yield put({
      //     type: 'clearcache',
      // });
      yield put({
        type: 'savelocalscriptlist',
        payload: response.data,
      });
    },

    // 添加
    *toaddlocalScript({ payload }, { call }) {
      return yield call(localscriptadd, payload);
    },

    // 编辑
    *toeditlocalScript({ payload }, { call }) {
      return yield call(localscriptedit, payload);
    },

    // 删除本地脚本列表数据
    *toDeletelocalScript({ payload }, { call }) {
      return yield call(deletelocalScript, payload);
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        localscriptlist: {},
        systemscriptlist: {},
      };
    },

    savesystemscriptlist(state, action) {
      return {
        ...state,
        systemscriptlist: action.payload,
      };
    },
    savelocalscriptlist(state, action) {
      return {
        ...state,
        localscriptlist: action.payload,
      };
    },
  },
};

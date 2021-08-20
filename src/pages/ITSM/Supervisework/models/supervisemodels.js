import route from 'umi/router';
import {
  message,
} from 'antd';
import {
  startFlow,
  saveForm,
  delaySave, // 延期保存
  submitForm, // 提交 填报表单提交到工作负责人
  openFlow,
  getMyWorkList,
  downloadMyWorkExcel,
  saveSupervise,
  getWorkQueryList,
  downloadWorkQueryExcel,
  delayToCheck, // 延期送审
  fallback,
  openView,
  getSuperviseList, // 获取督办列表
  taskDelete,
  getWorkUserList, // 工作负责人
  responseAccpt, // 接单
  toCheck, // 审核
  batchCheck, // 批量审核
} from '../services/superviseapi';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/check_/g, 'check.')
      .replace(/execute_/g, 'execute.'),
  );
  return newarr;
};

export default {
  namespace: 'supervisemodel',

  state: {
    getMyWorkList: [],  // 工作列表
    getworkqueryList: [], // 工作督办查询列表
    openFlowList: [],
    openViewlist: [],
    getSuperviseLists: [], // 获取督办列表
    superviseworkPersonArr: [] // 工作负责人列表
  },

  effects: {

    //  登记保存
    *saveallForm({ payload }, { call }) {
      const response = yield call(startFlow);
      if (response.code === 200) {
        const saveFormdata = payload;
        saveFormdata.main_id = response.mainId;
        saveFormdata.mainId = response.mainId;
        const values = replacerec(saveFormdata);
        const saveresponse = yield call(saveForm, values);
        if (saveresponse.code === 200) {
          message.success(saveresponse.msg);
          route.push({
            pathname: `/ITSM/supervisework/mycreatework`,
            query: { pathpush: true },
            state: { cache: false }
          })
        } else {
          message.error(saveresponse.msg);
        }
      }
    },

    //  除登记其他的表单保存
    *formSave({ payload }, { call }) {
      const values = replacerec(payload);
      return yield call(saveForm, values);
    },

    //  提交 --填报表单提交到工作负责人 （提交前添加、保存）
    *tosubmitForm({ payload }, { call }) {
      const response = yield call(startFlow);
      if (response.code === 200) {
        const saveFormdata = payload;
        saveFormdata.main_id = response.mainId;
        saveFormdata.mainId = response.mainId;
        const values = replacerec(saveFormdata);
        const saveresponse = yield call(saveForm, values);
        if (saveresponse.code === 200) {
          return yield call(submitForm, values);
        }
      }
      return false;
    },

    //  提交 --填报表单提交到工作负责人 （提交前只进行保存）
    *tosubmitForm1({ payload }, { call }) {
      const values = replacerec(payload);
      const saveresponse = yield call(saveForm, values);
      if (saveresponse.code === 200) {
        return yield call(submitForm, values);
      }
      return false;
    },

    //  打开待办
    *openFlow({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      })
      const response = yield call(openFlow, payload);
      yield put({
        type: 'openFlowList',
        payload: response
      })
    },
    //  粘贴
    *pasteFlow({ payload }, { call }) {
      return yield call(openFlow, payload);
    },

    //  工作列表
    *getMyWork({ payload }, { call, put }) {
      const response = yield call(getMyWorkList, payload);
      yield put({
        type: 'getMyWorkList',
        payload: response
      })
    },

    //  工作督办查询列表
    *getWorkQueryLists({ payload }, { call, put }) {
      const response = yield call(getWorkQueryList, payload);
      yield put({
        type: 'getworkqueryList',
        payload: response
      })
    },

    *tosaveSupervise({ payload }, { call }) {
      return yield call(saveSupervise, payload);
    },

    *todelaySave({ payload }, { call }) {
      return yield call(delaySave, payload);
    },

    //  工作列表-下载
    *downloadMyWorkExcel({ payload }, { call }) {
      return yield call(downloadMyWorkExcel, payload);
    },

    //  工作查询列表-下载
    *downloadWorkQueryExcels({ payload }, { call }) {
      return yield call(downloadWorkQueryExcel, payload);
    },

    //  回退
    *fallback({ payload }, { call }) {
      return yield call(fallback, payload);
    },

    // 审核前保存
    *toChecks({ payload }, { call }) {
      const values = replacerec(payload);
      const saveresponse = yield call(saveForm, values);
      if (saveresponse.code === 200) {
        return yield call(toCheck, values);
      }
      return false;
    },

    *tobatchCheck({ payload }, { call }) {
      const values = replacerec(payload);
      return yield call(batchCheck, values)
    },

    // 接单
    *responseAccpts({ payload }, { call }) {
      return yield call(responseAccpt, payload);
    },

    // 工作督办查询详情
    *openViews({ payload }, { call, put }) {
      const response = yield call(openView, payload);
      yield put({
        type: 'openViewlist',
        payload: response
      })
    },

    // 获取督办列表
    *togetSuperviseList({ payload }, { call, put }) {
      const response = yield call(getSuperviseList, payload);
      yield put({
        type: 'getSuperviseLists',
        payload: response
      })
    },

    //  删除
    *taskDelete({ payload }, { call }) {
      return yield call(taskDelete, payload);
    },

    //  粘贴
    *pasteData({ payload }, { call, put }) {
      const response = yield call(openFlow, payload);
      yield put({
        type: 'openFlowList',
        payload: response
      })
    },

    //  延期送审
    *delayToChecks({ payload }, { call }) {
      const values = replacerec(payload);
      const saveresponse = yield call(delaySave, values);
      if (saveresponse.code === 200) {
        return yield call(delayToCheck, values);
      }
      return false;
    },

    *getWorkUserList({ payload }, { call, put }) {
      const response = yield call(getWorkUserList, payload);
      yield put({
        type: 'superviseworkPersonArr',
        payload: response,
      });
    },
  },

  reducers: {
    getMyWorkList(state, action) {
      return {
        ...state,
        getMyWorkList: action.payload.data
      }
    },

    getworkqueryList(state, action) {
      return {
        ...state,
        getworkqueryList: action.payload.data
      }
    },

    openFlowList(state, action) {
      return {
        ...state,
        openFlowList: action.payload
      }
    },

    openViewlist(state, action) {
      return {
        ...state,
        openViewlist: action.payload.data
      }
    },

    getSuperviseLists(state, action) {
      return {
        ...state,
        getSuperviseLists: action.payload.data
      }
    },

    superviseworkPersonArr(state, action) {
      return {
        ...state,
        superviseworkPersonArr: action.payload.data
      }
    },

    clearcache(state) {
      return {
        ...state,
        getMyWorkList: [],  // 工作列表
        getworkqueryList: [], // 工作督办查询列表
        openFlowList: [],
        openViewlist: [],
        getSuperviseLists: [], // 获取督办列表
        superviseworkPersonArr: [] // 工作负责人列表
      }
    },

  }
}
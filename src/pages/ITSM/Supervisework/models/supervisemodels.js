import route from 'umi/router';
import {
  message,
} from 'antd';
import {
  saveForm,
  submitForm, // 填报表单提交到工作负责人
  startFlow,
  openFlow,
  getMyWorkList,
  downloadMyWorkExcel,
  saveSupervise,
  getWorkQueryList,
  downloadWorkQueryExcel,
  
//   censorshipSubmit,
//   fallback,
//   batchCheck,
//   batchToCheck,
//   getOperationQueryList,
//   openView,
  taskDelete,
//   submit,
//   downloadQueryExcel,
//   delay,
  getWorkUserList, // 工作负责人
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
    // checkList: [],
    getMyWorkList: [],  // 工作列表
    getworkqueryList: [], // 工作督办查询列表
    openFlowList: [],
    // getsuperviseList: [],
    // queryList: [],
    // openViewlist: [],
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
      return yield call(saveForm, values)
    },
    
    //  填报表单提交到工作负责人
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

    //  打开待办
    *openFlow({ payload }, { call, put }) {
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


    // //  周报我的作业计划列表
    // *weekmyTasklist({ payload }, { call, put }) {
    //   return yield call(myTasklist, payload);
    // },

    // //  提交送审人
    // *censorshipSubmit({ payload }, { call, put }) {
    //   return yield call(censorshipSubmit, payload)
    // },

    //  我的创建作业-下载
    *downloadMyWorkExcel({ payload }, { call}) {
      return yield call(downloadMyWorkExcel, payload);
    },

    //  我的创建作业-下载
    *downloadWorkQueryExcels({ payload }, { call}) {
      return yield call(downloadWorkQueryExcel, payload);
    },

    // //  回退
    // *fallback({ payload }, { call, put }) {
    //   return yield call(fallback, payload)
    // },

    // //  送审
    // *batchToCheck({ payload }, { call, put }) {
    //   return yield call(batchToCheck, payload)
    // },
    // //  审核
    // *batchCheck({ payload }, { call, put }) {
    //   const values = replacerec(payload);
    //   return yield call(batchCheck, values)
    // },

    // //  我的作业计划查询列表
    // *getOperationQueryList({ payload }, { call, put }) {
    //   const response = yield call(getOperationQueryList, payload);
    //   yield put({
    //     type: 'queryList',
    //     payload: response
    //   })
    // },
    // //  我的作业计划查询详情
    // *openView({ payload }, { call, put }) {
    //   const response = yield call(openView, payload);
    //   yield put({
    //     type: 'openViewlist',
    //     payload: response
    //   })
    // },
    //  删除
    *taskDelete({ payload }, { call }) {
      return yield call(taskDelete, payload)
    },

    //  粘贴
    *pasteData({ payload }, { call, put }) {
      const response = yield call(openFlow, payload);
      yield put({
        type: 'openFlowList',
        payload: response
      })
    },

    // //  确定执行提交
    // *submit({ payload }, { call, put }) {
    //   const values = replacerec(payload);
    //   return yield call(submit, values)
    // },

    // //  下载查询页
    // *downloadQueryExcel({ payload }, { call, put }) {
    //   return yield call(downloadQueryExcel, payload)
    // },

    // //  确定延期
    // *delay({ payload }, { call, put }) {
    //   return yield call(delay, payload)
    // },

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

    // getsuperviseList(state, action) {
    //   return {
    //     ...state,
    //     getsuperviseList: action.payload
    //   }
    // },

    // queryList(state, action) {
    //   return {
    //     ...state,
    //     queryList: action.payload.data
    //   }
    // },

    // openViewlist(state, action) {
    //   return {
    //     ...state,
    //     openViewlist: action.payload.data
    //   }
    // },

    superviseworkPersonArr(state, action) {
      return {
        ...state,
        superviseworkPersonArr: action.payload.data
      }
    },

  }
}
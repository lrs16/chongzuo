// import route from 'umi/router';
import {
  // 登记页
  addApplyForm, // 新增进出人员
  findRegistList, // 获取人员进出登记列表
  findCheckList, // 获取人员进出审核列表
  deleteApplyForms, // 进出人员信息多选删除
  downloadRegistExport, // 进出人员登记导出
  downloadCheckExport, // 进出人员审核导出
  sendCheck, // 编辑按钮送审
  // sendCheckAdd, // 添加按钮送审
  checkRegist, // 审核
  saveCheck, // 保存
} from '../services/applyapi';

export default {
  namespace: 'apply',

  state: {
    findRegistlist: [],
    findChecklist: [],
  },

  effects: {
    // 新增人员进出申请
    *saveApplyForm({ payload }, { call }) {
      return yield call(addApplyForm, payload);
    },

    //  进出人员登记查询列表
    *findRegistList({ payload }, { call, put }) {
      const response = yield call(findRegistList, payload);
      yield put({
        type: 'findRegistlist',
        payload: response
      })
    },

    //  进出人员审核查询列表
    *findCheckList({ payload }, { call, put }) {
      const response = yield call(findCheckList, payload);
      yield put({
        type: 'findChecklist',
        payload: response
      })
    },

    *deleteApplyForms({ payload }, { call }) {
      return yield call(deleteApplyForms, payload);
    },

    //  登记进出人员导出
    *downloadRegistExport({ payload }, { call }) {
      return yield call(downloadRegistExport, payload);
    },

    //  审核进出人员导出
    *downloadCheckExports({ payload }, { call }) {
      return yield call(downloadCheckExport, payload);
    },

    // 登记进出人员 编辑送审
    *sendCheck({ payload }, { call }) {
      return yield call(sendCheck, payload);
    },

    // 登记进出人员 添加送审
    // *sendCheckAdd({ payload }, { call }) {
    //   return yield call(sendCheckAdd, payload);
    // },
    
    *checkRegist({ payload }, { call }) {
      return yield call(checkRegist, payload);
    },

    *saveCheck({ payload }, { call }) {
      return yield call(saveCheck, payload);
    },
  },

  reducers: {
    findRegistlist(state, action) {
      return {
        ...state,
        findRegistlist: action.payload.data
      }
    },
    findChecklist(state, action) {
      return {
        ...state,
        findChecklist: action.payload.data
      }
    },
  }
}
// import route from 'umi/router';
import {
  // 登记页
  addApplyForm, // 新增进出人员
  findRegistList, // 获取人员进出登记列表
  deleteApplyForm, // 进出人员信息删除
  downloadRegistExport, // 进出人员导出
  checkRegist, // 送审
} from '../services/applyapi';

export default {
  namespace: 'apply',

  state: {
    findRegistlist: [],
  },

  effects: {
    // 新增人员进出申请
    *saveApplyForm({ payload }, { call }) {
      return yield call(addApplyForm, payload);
    },

    //  进出人员查询列表
    *findRegistList({ payload }, { call, put }) {
      const response = yield call(findRegistList, payload);
      yield put({
        type: 'findRegistlist',
        payload: response
      })
    },

    *deleteApplyForm({ payload: { registId } }, { call }) {
      return yield call(deleteApplyForm, registId);
    },

    //  登记进出人员导出
    *downloadRegistExport({ payload }, { call }) {
      return yield call(downloadRegistExport, payload);
    },

    // 登记进出人员 送审
    *checkRegist({ payload }, { call }) {
      return yield call(checkRegist, payload);
    },

  },

  reducers: {
    findRegistlist(state, action) {
      return {
        ...state,
        findRegistlist: action.payload.data
      }
    },
  }
}
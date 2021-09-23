import {
  staffSave,
  staffSearch,
  staffDel,
  holidayId,
  staffAdd
} from '../services/dutyandtypesetting';

export default {
  namespace:'dutyandtypesetting',

  state:{
    searchUsersarr:[]
  },

  effects:{
    *fetchDutysave({ payload },{ call, put }) {
      return yield call(staffSave,payload);
    },

    *staffSearch({ payload }, { call, put }) {
      const response = yield call(staffSearch,payload);
      yield put ({
        type:'searchUsersarr',
        payload:response
      })
    },

    *fetchstaffDel({ payload },{ call, put }) {
      return yield call(staffDel,payload);
    },

    *fetchholidayId({ payload }, { call, put }) {
      return  yield call(holidayId,payload);
    },

    //  排版设置新增
    *fetchstaffAdd({ payload }, { call, put }) {
      return yield call(staffAdd,payload)
    }
  },

  reducers: {
    searchUsersarr(state, acttion) {
      return {
        ...state,
        searchUsersarr: acttion.payload.data
      }
    },
  }
}
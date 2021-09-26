import {
  staffSave,
  staffSearch,
  staffDel,
  holidayId,
  delmonth,
  delId,
  template,
  tableGroupId
} from '../services/dutyandtypesetting';

export default {
  namespace:'dutyandtypesetting',

  state:{
    searchUsersarr:[],
    tableArr:[],
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

    *fetchtable({ payload }, { call, put }) {
      const response = yield call(tableGroupId,payload);
      yield put({
        type:'tableArr',
        payload: response
      })
    },
  
    *fetchDelmonth({ payload }, { call, put }) {
      return yield call(delmonth,payload)
    },

    // 删除人
    *fetchdelId({ payload }, { call, put }) {
      return yield call(delId,payload)
    },

    *fetchTemplate({ payload },{ call, put }) {
      return yield call(template,payload);
    },
  },

  reducers: {
    searchUsersarr(state, acttion) {
      return {
        ...state,
        searchUsersarr: acttion.payload.data
      }
    },
    tableArr(state, acttion) {
      return {
        ...state,
        tableArr: acttion.payload.data
      }
    },
    
  }
}
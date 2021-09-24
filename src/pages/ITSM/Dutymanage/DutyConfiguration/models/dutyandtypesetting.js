import {
  staffSave,
  staffSearch,
  staffDel,
  holidayId,
  staffAdd,
  tableGroupId,
  scheduleId,
  staffUpdata
} from '../services/dutyandtypesetting';

export default {
  namespace:'dutyandtypesetting',

  state:{
    searchUsersarr:[],
    tableArr:[],
    settingDetails:[]
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
    },
    
    *fetchtable({ payload }, { call, put }) {
      const response = yield call(tableGroupId,payload);
      yield put({
        type:'tableArr',
        payload: response
      })
    },

    *fetchscheduleDetail({ payload }, { call, put }) {
      const response = yield call(scheduleId,payload);
      yield put({
        type:'settingDetails',
        payload: response
      })
    },

    //  排版设置更新
    *fetchstaffUpdata({ payload }, { call, put }) {
      return yield call(staffUpdata,payload)
    },

    *clearstaff({ payload }, { call, put }) {
      yield put ({
        type:'clear'
      })
    }
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
    settingDetails(state, action) {
      return {
        ...state,
        settingDetails: action.payload.data
      }
    },
    clear(state,action) {
      return {
        ...state,
        settingDetails:[]
      }
    }
  }
}
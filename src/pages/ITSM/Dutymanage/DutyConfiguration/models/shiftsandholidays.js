import {
  shiftSave,
  shiftSearch,
  shiftDel,
  holidaySave,
  holidaySearch,
  holidayDel,
  holidayId,
  holidayStart,
  tableGroupId,
  scheduleId,
  staffAdd,
  staffUpdata
} from '../services/shiftsandholidays';

export default {
  namespace:'shiftsandholidays',

  state:{
    shiftSearcharr:[],
    holidaySearcharr:[],
    holidayDetail:[],
    settingDetails:[]
  },

  effects: {
    //  班次保存
    *fetchShiftsave({ payload }, { call, put }) {
      return yield call(shiftSave,payload)
    },

    // 班次列表
    *fetchshiftSearch({ payload }, { call, put }) {
      const response = yield call(shiftSearch,payload);
      yield put ({
        type:'shiftSearcharr',
        payload:response
      })
    },
    // 清楚班次列表
    *cleardata({ payload }, { call, put }) {
      console.log(11);
      yield put ({
        type:'clearData',
        payload:[]
      })
    },

    //  班次删除
    *fetchshiftDel({payload},{ call, put }) {
      return yield call(shiftDel,payload)
    },

    // 添加节假日
    *fetchholidaySave({ payload }, { call, put }) {
      return yield call(holidaySave,payload)
    },

    //  节假日列表
    *fetchholidaySearch({ payload }, { call, put }) {
      const response = yield call(holidaySearch,payload);
      yield put ({
        type:'holidaySearcharr',
        payload:response
      })
    },

    //  节假日删除
    *fetchholidayDel({payload},{ call, put }) {
      return yield call(holidayDel,payload)
    },

    *fetchholidayId({ payload }, { call, put }) {
      return  yield call(holidayId,payload);
    },

    *fetchStart({ payload }, { call, put }) {
      return yield call(holidayStart,payload)
    },

    *fetchscheduleDetail({ payload }, { call, put }) {
      const response = yield call(scheduleId,payload);
      yield put({
        type:'settingDetails',
        payload: response
      })
    },

    *clearstaff({ payload }, { call, put }) {
      yield put ({
        type:'clear'
      })
    },

     //  排版设置新增
     *fetchstaffAdd({ payload }, { call, put }) {
      return yield call(staffAdd,payload)
    },

     //  排版设置更新
     *fetchstaffUpdata({ payload }, { call, put }) {
      return yield call(staffUpdata,payload)
    },
 
  },

  reducers: {
    shiftSearcharr(state, acttion) {
      return {
        ...state,
        shiftSearcharr: acttion.payload.data
      }
    },
    holidaySearcharr(state, acttion) {
      return {
        ...state,
        holidaySearcharr: acttion.payload.data
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
        settingDetails:''
      }
    },

    clearData(state,action) {
      console.log(44)
      return {
        ...state,
        shiftSearcharr:[]
      }
    }


  }
}

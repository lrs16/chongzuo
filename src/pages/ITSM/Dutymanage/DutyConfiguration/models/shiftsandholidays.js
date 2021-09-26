import {
  shiftSave,
  shiftSearch,
  shiftDel,
  holidaySave,
  holidaySearch,
  holidayDel,
  holidayId,
  holidayStart,
  delmonth,
  delId
} from '../services/shiftsandholidays';

export default {
  namespace:'shiftsandholidays',

  state:{
    shiftSearcharr:[],
    holidaySearcharr:[],
    holidayDetail:[]

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


  }
}

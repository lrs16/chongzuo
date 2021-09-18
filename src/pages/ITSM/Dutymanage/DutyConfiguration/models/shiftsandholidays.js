import {
  shiftSave,
  shiftSearch,
  shiftDel
} from '../services/shiftsandholidays';

export default {
  namespace:'shiftsandholidays',

  state:{
    shiftSearcharr:[]

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
    }

  },

  reducers: {
    shiftSearcharr(state, acttion) {
      return {
        ...state,
        shiftSearcharr: acttion.payload.data
      }
    }


  }
}

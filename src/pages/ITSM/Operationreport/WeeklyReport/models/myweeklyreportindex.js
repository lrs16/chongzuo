import {
  myweeklyTable
} from '../services/myweeklyreportindex';


export default {
  namespace:'myweeklyreportindex',

  state: {
    myweeklyreportTable:[]
  },

  effects:{
    *myweeklyTable({ payload }, { call, put }) {
      const response = yield call(myweeklyTable);
      yield put ({
        type:'myweeklyreportTable',
        payload:response
      })
    }
  },

  reducers:{
    myweeklyreportTable(state,action) {
      return {
        ...state,
        myweeklyreportTable: action.payload
      }
    }
  }

}
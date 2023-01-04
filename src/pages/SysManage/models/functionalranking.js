import {
  getLoginUserTop,
  getTabClickNumTop
} from '../services/functionalranking';

export default {
  namespace:'functionalranking',

  state:{
    loginUserToparr:[],
    tabClickNumToparr:[]
  },

  effects:{
    *fetchgetLoginUserTop({ payload }, { call, put}) {
      const response = yield call(getLoginUserTop,payload);
      yield put({
        type:'loginUserToparr',
        payload:response
      })
    },

    *fetchgetTabClickNumTop({ payload }, { call, put}) {
      const response = yield call(getTabClickNumTop,payload);
      yield put({
        type:'tabClickNumToparr',
        payload:response
      })
    },




  },

  reducers: {
    loginUserToparr(state,action) {
      return {
        ...state,
        loginUserToparr:action.payload.data
      }
    },
    tabClickNumToparr(state,action) {
      return {
        ...state,
        tabClickNumToparr:action.payload.data
      }
    },

  }
}
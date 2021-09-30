import {
  logbookSave,
  logbookSearch,
  currentUser,
  shiftGroup,
  logbookDel,
  logbookTransfer,
  logbookMy,
  logbookId
} from '../services/api'


export default {
  namespace:'shifthandover',

  state:{
    logbookSearcharr:[],
    currentUserarr:[],
    shiftGrouparr:[],
    logbookIddetail:[]
  },

  effects: {
    *fetchlogbookSave({ payload },{ call, put }) {
      return yield call(logbookSave,payload)
    },

    *fetchlogbookSearch({payload},{call,put}) {
      const response = yield call(logbookMy,payload);
      yield put ({
        type:'logbookSearcharr',
        payload:response
      })
    },
    *fetchcurrentUser({payload},{call,put}) {
      const response = yield call(currentUser,payload);
      yield put ({
        type:'currentUserarr',
        payload:response
      })
    },

    *fetchshiftGroup({payload},{call,put}) {
      const response = yield call(shiftGroup,payload);
      yield put ({
        type:'shiftGrouparr',
        payload:response
      })
    },
    *fetchlogbookDel({ payload },{ call, put }) {
      return yield call(logbookDel,payload)
    },

    *fetchlogbookTransfer({ payload },{ call, put }) {
      return yield call(logbookTransfer,payload)
    },

    *fetchlogbookId({payload},{call,put}) {
      const response = yield call(logbookId,payload);
      yield put ({
        type:'logbookIddetail',
        payload:response
      })
    },
  },

  reducers:{
    logbookSearcharr(state,acttion) {
      return {
        ...state,
        logbookSearcharr:acttion.payload.data
      }
    },
    currentUserarr(state,acttion) {
      return {
        ...state,
        currentUserarr:acttion.payload.data
      }
    },
    shiftGrouparr(state,acttion) {
      return {
        ...state,
        shiftGrouparr:acttion.payload.data
      }
    },
    logbookIddetail(state,acttion) {
      return {
        ...state,
        logbookIddetail:acttion.payload.data
      }
    },

  }
}
import {
  logbookSave,
  logbookSearch,
  currentUser,
  shiftGroup,
  logbookDel,
  logbookTransfer,
  logbookMy,
  logbookId
} from '../services/api';
import router from 'umi/router';


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
      if(payload.logbookNo) {
        return yield call(logbookSave,payload)
      } 
      if(!payload.logbookNo) {
        const response = yield call(logbookSave,payload);
        if(response.code === 200) {
          router.push({
            pathname:'/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/newhandover',
            query:{
              tabid: sessionStorage.getItem('tabid'),
              closecurrent: true,
            }
          });
          const { id } = response.data;
          router.push({
            pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
            query: { 
              id,
              Id:id,
              },
              state: {
                dynamicpath: true,
                menuDesc: '我的交接班详情',
              },
          })
        }
      }
      return []
    
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
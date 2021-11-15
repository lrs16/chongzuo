import {
  message
} from 'antd';
import {
  logbookSave,
  logbookSearch,
  currentUser,
  shiftGroup,
  logbookDel,
  logbookTransfer,
  logbookMy,
  logbookId,
  logbookWord,
  logbookReceive,
  logbookDownload,
  statsIndex,
  fallback,
} from '../services/api';
import router from 'umi/router';


export default {
  namespace:'shifthandover',

  state:{
    logbookSearcharr:[],
    currentUserarr:[],
    shiftGrouparr:[],
    logbookIddetail:[],
    statsIndexarr:[]
  },

  effects: {
    *fetchlogbookSave({ payload },{ call, put }) {
      if(payload.logbookNo) {
        return yield call(logbookSave,payload)
      } 
      if(!payload.logbookNo) {
        const res = yield call(logbookMy,{current:1,size:15});
        const { data } = res;
        if(data && data.records && data.records.length) {
          message.error('我的值班交接列表只能有一条数据哦，请先处理值班交接列表的数据再新增')
        } else {
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
              pathname: '/ITSM/dutymanage/dutyhandovermanage/edithandoverdetail',
              query: { 
                id,
                Id:id,
                },
                state: {
                  dynamicpath: true,
                  menuDesc: '值班交接',
                },
            })
          }
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

    *fetchlogbookSearchall({payload},{call,put}) {
      const response = yield call(logbookSearch,payload);
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
    
    *fetchlogbookWord({ payload },{ call, put }) {
      return yield call(logbookWord,payload)
    },

    *fetchlogbookReceive({ payload },{ call, put }) {
      return yield call(logbookReceive,payload)
    },

    *fetchlogbookDownload({ payload },{ call, put }) {
      return yield call(logbookDownload,payload)
    },

    *fetchstatsIndex({payload},{call,put}) {
      const response = yield call(statsIndex,payload);
      yield put ({
        type:'statsIndexarr',
        payload:response
      })
    },

    *clearlogbookIddetail({ payload }, { call, put }) {
      yield put ({
        type:'clearlogbook',
        payload:[]
      })
    },

    *fetchfallback({ payload },{ call, put }) {
      return yield call(fallback,payload)
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
    statsIndexarr(state,acttion) {
      return {
        ...state,
        statsIndexarr:acttion.payload.data
      }
    },
    clearlogbook(state,acttion) {
      return {
        ...state,
        logbookIddetail:''
      }
    },
  }
}
import {
  querkeyVal,
} from '../services/api';

export default {
  namespace: 'problemdropdown',

  state: {
    keyVallist:[],
    typelist:[],
    prioritylist:[],
    scopeList:[],
    handleList:[],
    projectList:[],
    stateList:[],
    orderList:[],
  },

  effects: {
    //  问题数据来源
    *keyvalsource({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      switch(dictType) {
        case 'source':
          yield put({
            type:'keyVallist',
            payload: response
          })
          break;
        case 'type':
          yield put({
            type:'typelist',
            payload: response
          })
          break;
        case 'priority':
          yield put({
            type:'prioritylist',
            payload: response
          })
          break;
        case 'effect':
          yield put({
            type:'scopeList',
            payload: response
          })
          break;
        case 'handleresult':
          yield put({
            type:'handleList',
            payload: response
          })
          break;
        case 'project':
          yield put({
            type:'projectList',
            payload: response
          })
          break;
        case 'orderstate':
          yield put({
            type:'orderList',
            payload: response
          })
          break;
        case 'current':
          yield put({
            type:'stateList',
            payload: response
          })
          break;
        default:
          break;
        
      }
    },
  },

  reducers: {
    keyVallist(state,action) {
      return {
        ...state,
        keyVallist: action.payload.data
      }
    },

    typelist(state,action) {
      return {
        ...state,
        typelist: action.payload.data
      }
    },

    prioritylist(state,action) {
      return {
        ...state,
        prioritylist: action.payload.data
      }
    },
    scopeList(state,action) {
      return {
        ...state,
        scopeList: action.payload.data
      }
    },

    handleList(state,action) {
      return {
        ...state,
        handleList: action.payload.data
      }
    },

    projectList(state,action) {
      return {
        ...state,
        projectList: action.payload.data
      }
    },

    stateList(state,action) {
      return {
        ...state,
        stateList: action.payload.data
      }
    },

    orderList(state,action) {
      return {
        ...state,
        orderList: action.payload.data
      }
    },

  },
};

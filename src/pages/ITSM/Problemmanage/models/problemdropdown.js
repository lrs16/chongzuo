import route from 'umi/router';
import {
  querkeyVal
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
    orderList:[]
  },

  effects: {
    // 列表
 
    //  问题数据来源
    *keyvalsource({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      yield put({
        type:'keyVallist',
        payload: response
      })
    },
    //  问题分类
    *keyvaltype({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      yield put({
        type:'typelist',
        payload: response
      })
    },
    //  问题重要程度
    *keyvalpriority({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      yield put({
        type:'prioritylist',
        payload: response
      })
    },

    //  问题影响范围
    *keyvalScope({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      yield put({
        type:'scopeList',
        payload: response
      })
    },

    //  处理结果
    *keyvalHandleresult({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      yield put({
        type:'handleList',
        payload: response
      })
    },

      //  所属项目
    *keyvalProject({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      console.log('response: ', response);
      yield put({
        type:'projectList',
        payload: response
      })
    },

      //  当前处理环节
    *keyvalstate({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      console.log('response: ', response);
      yield put({
        type:'stateList',
        payload: response
      })
    },
      //  工单状态
    *keyvalorder({ payload: { dictModule, dictType } }, { call,put }) {
      const response = yield call(querkeyVal, dictModule, dictType);
      console.log('response: ', response);
      yield put({
        type:'orderList',
        payload: response
      })
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

import {
  relateDictList,
  faultdownlistDownload,
  faultList,
  faultDownload,
  faulthandleGrate,
  faulthandleList,
  handlegrateDownload,
  timeoutList,
  timeoutDownload,
  queryOrderConditions, // 统计分析-工单总情况
  queryBlameConditions, // 统计分析-故障责任单位总情况
  queryTypeConditions, // 统计分析-故障分类总情况
  queryModelConditions, // 统计分析-故障模块总情况
  queryTimeOutConditions, // 统计分析-故障超时总情况
  queryRegisterUserTop, // 统计分析-故障登记人排名
  queryRegisterUnitTop, // 统计分析-故障登记人单位排名
  queryHandlerTop, // 统计分析-故障处理人排名
  queryHandleUnitTop, // 统计分析-故障处理人单位排名
} from '../services/statistics'; 

export default {
  namespace: 'faultstatics',

  state: {
    handlingratedata: [],
    statusArr: [],
    faultArr: [],
    relatedictArr: [],
    faultdetailArr: [],
    timeoutArr: [],
    analysislist: {}, // 统计分析-工单总情况
    blameconditlist: {}, // 统计分析-故障责任单位总情况
    typeconditlist: {}, // 统计分析-故障分类总情况
    modelconditlist: {}, // 统计分析-故障模块总情况
    timeoutconditlist: {}, // 统计分析-故障超时总情况
    registeruserlist: {}, // 统计分析-故障登记人排名
    registeruserunitlist: {}, // 统计分析-故障登记人单位排名
    handlerlist: {}, // 统计分析-故障处理人排名
    handleunitlist: {}, // 统计分析-故障处理人单位排名
  },

  effects: {
    // 故障统计查询页的列表
    *fetchrelateDictList({ payload }, { call, put }) {
      const response = yield call(relateDictList, payload);
      yield put({
        type: 'relatedictArr',
        payload: response
      })
    },

    // 问题分类统计
    *fetchfaultlist({ payload }, { call, put }) {
      const response = yield call(faultList, payload);
      yield put({
        type: 'faultArr',
        payload: response
      })
    },
    //  导出故障明细表
    * downloadFaultdetail({ payload }, { call }) {
      return yield call(faultDownload, payload);
    },
    // 导出故障汇总统计
    *downloadFaultdownlist({ payload }, { call }) {
      return yield call(faultdownlistDownload, payload);
    },

    // 故障状态统计
    *fetchfaulthandle({ payload }, { call, put }) {
      const response = yield call(faulthandleGrate, payload);
      yield put({
        type: 'faultdetailArr',
        payload: response
      })
    },

    // 故障状态统计查询页面
    *fetchfaulthandleList({ payload }, { call, put }) {
      const response = yield call(faulthandleList, payload);
      yield put({
        type: 'relatedictArr',
        payload: response
      })
    },

    // 导出问题处理率
    * downloadHandlegrate(_, { call }) {
      return yield call(handlegrateDownload);
    },

    // 超时统计列表
    *timeoutLists({ payload }, { call, put }) {
      const response = yield call(timeoutList, payload);
      yield put({
        type: 'timeoutArr',
        payload: response
      })
    },
    // 导出超时统计
    *timeDownload(_, { call }) {
      return yield call(timeoutDownload);
    },

    //  统计分析-工单总情况
    *getOrderConditions({ payload }, { call, put }) {
      const response = yield call(queryOrderConditions, payload);
      yield put({
        type: 'saveanalysislist',
        payload: response,
      });
    },

    //  统计分析-故障责任单位总情况
    *getBlameConditions({ payload }, { call, put }) {
      yield put({
        type: 'clearcache'
      })
      const response = yield call(queryBlameConditions, payload);
      yield put({
        type: 'saveblameconditlist',
        payload: response,
      });
    },

    //  统计分析-故障分类总情况
    *getTypeConditions({ payload }, { call, put }) {
      const response = yield call(queryTypeConditions, payload);
      yield put({
        type: 'savetypeconditions',
        payload: response,
      });
    },

    //  统计分析-故障模块总情况
    *getModelConditions({ payload }, { call, put }) {
      const response = yield call(queryModelConditions, payload);
      yield put({
        type: 'savemodelconditions',
        payload: response,
      });
    },

    //  统计分析-故障超时总情况
    *getTimeOutConditions({ payload }, { call, put }) {
      const response = yield call(queryTimeOutConditions, payload);
      yield put({
        type: 'savetimeoutconditions',
        payload: response,
      });
    },

    //  统计分析-故障登记人排名
    *getRegisterUserTop({ payload }, { call, put }) {
      const response = yield call(queryRegisterUserTop, payload);
      yield put({
        type: 'saveregisteruser',
        payload: response,
      });
    },   

    //  统计分析-故障登记人单位排名
    *getRegisterUnitTop({ payload }, { call, put }) {
      const response = yield call(queryRegisterUnitTop, payload);
      yield put({
        type: 'saveregisteruserunit',
        payload: response,
      });
    }, 

    //  统计分析-故障处理人排名
    *getHandlerTop({ payload }, { call, put }) {
      const response = yield call(queryHandlerTop, payload);
      yield put({
        type: 'savehandler',
        payload: response,
      });
    },

    //  统计分析-故障处理人单位排名
    *queryHandleUnitTop({ payload }, { call, put }) {
      const response = yield call(queryHandleUnitTop, payload);
      yield put({
        type: 'savehandleunit',
        payload: response,
      });
    },
  },

  reducers: {
    clearcache(state){
      return{
        ...state,
        blameconditlist: {}, // 统计分析-故障责任单位总情况
        typeconditlist: {}, // 统计分析-故障分类总情况
        modelconditlist: {}, // 统计分析-故障模块总情况
        timeoutconditlist: {}, // 统计分析-故障超时总情况
      }
    },
    // 问题状态列表
    relatedictArr(state, action) {
      return {
        ...state,
        relatedictArr: action.payload.data
      }
    },

    faultArr(state, action) {
      return {
        ...state,
        faultArr: action.payload.data
      }
    },

    faultdetailArr(state, action) {
      return {
        ...state,
        faultdetailArr: action.payload.data
      }
    },

    saveanalysislist(state, action) { // 故障统计分析 -工单总情况
      return {
        ...state,
        analysislist: action.payload.data,
      };
    },

    saveblameconditlist(state, action) { // 故障统计分析 -故障责任单位总情况
      return {
        ...state,
        blameconditlist: action.payload.data,
      };
    },

    savetypeconditions(state, action) { // 故障统计分析 -故障分类总情况
      return {
        ...state,
        typeconditlist: action.payload.data,
      };
    },

    savemodelconditions(state, action) { // 故障统计分析 -故障模块总情况
      return {
        ...state,
        modelconditlist: action.payload.data,
      };
    },

    savetimeoutconditions(state, action) { // 故障统计分析 -故障模块总情况
      return {
        ...state,
        timeoutconditlist: action.payload.data,
      };
    },

    saveregisteruser(state, action) { // 故障统计分析 -故障登记人排名
      return {
        ...state,
        registeruserlist: action.payload.data,
      };
    },   

    saveregisteruserunit(state, action) { // 故障统计分析 -故障登记人单位排名
      return {
        ...state,
        registeruserunitlist: action.payload.data,
      };
    },

    savehandler(state, action) { // 故障统计分析 -故障处理人排名
      return {
        ...state,
        handlerlist: action.payload.data,
      };
    },

    savehandleunit(state, action) { // 故障统计分析 -故障处理人单位排名
      return {
        ...state,
        handleunitlist: action.payload.data,
      };
    },
  },
};
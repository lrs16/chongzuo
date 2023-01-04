import {
  executeResult,
  operationStatus,
  timeoutStatus,
  userExecuteStatus,
  downloadExecuteResult, // 统计类
  downloadOperationStatus,
  downloadTimeoutStatus,
  downloadUserExecuteStatus,
} from '../services/statisticsapi';

export default {
  namespace: 'taskstatistics',

  state: {
    maintenanceArr:[],
    maintenanceService:[],
    resultArr:[], //  结果统计
    operationStatusArr:[], // 作业计划状态统计
    timeoutStatusArr:[], // 超时状态统计
    userExecuteStatusArr:[], // 执行情况统计
    primaryObject:[]
  },

  effects: {

    // 作业结果统计
    *executeResult({ payload }, { call, put }) {
      const response = yield call(executeResult,payload);
      yield put ({
        type: 'resultArr',
        payload: response
      })
    },
    // 作业计划状态统计
    *operationStatus({ payload }, { call, put }) {
      const response = yield call(operationStatus,payload);
      yield put ({
        type: 'operationStatusArr',
        payload: response
      })
    },
    // 超时状态统计
    *timeoutStatus({ payload }, { call, put }) {
      const response = yield call(timeoutStatus,payload);
      yield put ({
        type: 'timeoutStatusArr',
        payload: response
      })
    },
    //  执行情况统计
    *userExecuteStatus({ payload }, { call, put }) {
      const response = yield call(userExecuteStatus,payload);
      yield put ({
        type: 'userExecuteStatusArr',
        payload: response
      })
    },

    //  下载类
    //   下载作业结果统计
    *downloadExecuteResult({payload},{ call, put }) {
      return yield call(downloadExecuteResult, payload)
    },

    //   下载作业计划状态统计
    *downloadOperationStatus({payload},{ call, put }) {
      return yield call(downloadOperationStatus, payload)
    },

    //   下载超时状态统计
    *downloadTimeoutStatus({payload},{ call, put }) {
      return yield call(downloadTimeoutStatus, payload)
    },

    //   下载执行情况统计
    *downloadUserExecuteStatus({payload},{ call, put }) {
      return yield call(downloadUserExecuteStatus, payload)
    },
  },

  reducers: {
  // 运维分类情况统计列表
  maintenanceArr(state, action) {
    return {
      ...state,
      maintenanceArr: action.payload
    }
  },

  // 维服务指标统计列表
  eventServicearr(state, action) {
    return {
      ...state,
      maintenanceService: action.payload.data
    }
  },
  // 结果统计
  resultArr(state, action) {
    return {
      ...state,
      resultArr: action.payload.data
    }
  },
  // 作业计划状态统计
  operationStatusArr(state, action) {
    return {
      ...state,
      operationStatusArr: action.payload.data
    }
  },

    // 超时状态统计
    timeoutStatusArr(state, action) {
      return {
        ...state,
        timeoutStatusArr: action.payload.data
      }
    },
  // 执行统计列表
  userExecuteStatusArr(state, action) {
    return {
      ...state,
      userExecuteStatusArr: action.payload.data
    }
  },

  },
};
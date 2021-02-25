import {
  statusList,
  statusDownload,
  classList,
  classDownload,
  handleGrate,
  handlegrateDownload,
  timeoutList,
  timeoutDownload
} from '../services/statistics';

export default {
  namespace: 'problemstatistics',

  state: {
    handlingratedata:[],
    statusArr:[],
    classArr:[],
    handleArr:[],
    timeoutArr:[]
  },

  effects: {
    // 问题状态列表
    *fetchstatusList({ payload }, { call, put }) {
      const response = yield call(statusList,payload);
      yield put ({
        type: 'statusList',
        payload: response
      })
    },

    // 问题状态下载
    *download({ payload }, { call }) {
      return yield call(statusDownload, { payload });
    },

    // 问题分类统计
    *fetchClasslist({ payload }, { call, put }) {
      const response = yield call(classList,payload);
      yield put ({
        type: 'classArr',
        payload: response
      })
    },

     //  导出问题分类统计
     * downloadClass({ payload }, { call }) {
       return yield call(classDownload,payload);
     },

     // 问题处理率
     * handleLists({ payload }, { call, put }) {
      return yield call(handleGrate,payload);
     },

     // 导出问题处理率
     * downloadHandlegrate({ payload },{ call }) {
       return yield call(handlegrateDownload);
     },

     // 超时统计列表
     *timeoutLists({ payload }, { call, put }) {
       const response = yield call(timeoutList,payload);
       yield put ({
         type:'timeoutArr',
         payload: response
       })
     },
     // 导出超时统计
     *timeDownload({ payload }, { call, put }) {
       return yield call(timeoutDownload);
     }

    

  },

  reducers: {
  // 问题状态列表
  statusList(state, action) {
    return {
      ...state,
      statusArr: action.payload.data
    }
  },

  classArr(state, action) {
    return {
      ...state,
      classArr: action.payload.data
    }
  },

  timeoutArr(state,action) {
    return {
      ...state,
      timeoutArr: action.payload.data
    }
  }
  },
};
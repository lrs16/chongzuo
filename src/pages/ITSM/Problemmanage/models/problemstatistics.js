import {
  statusList,
  statusDownload,
  classList,
  classDownload,
  handleGrate,
  handlegrateDownload,
  timeoutList,
  timeoutDownload,
  solvescheduleDownload
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
      return yield call(statusDownload, payload);
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

     // 问题解决管控表
     * handleLists({ payload }, { call, put }) {
      const response =  yield call(handleGrate,payload);
      yield put ({
        type:'handlingratedata',
        payload:response
      })
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
       return yield call(timeoutDownload,payload);
     },
     // 导出问题工单解决进度管控统计结果

    *solveschedule({ payload }, { call, put }) {
        return yield call(solvescheduleDownload,payload);
      },
    

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
  },

  handlingratedata(state,action) {
    return {
      ...state,
      handlingratedata: action.payload.data
    }
  }
  },
};
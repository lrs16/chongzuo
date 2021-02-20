import {
  statusList,
  statusDownload,
  classList,
  classDownload
} from '../services/statistics';

export default {
  namespace: 'problemstatistics',

  state: {
    handlingratedata:[],
    statusArr:[],
    classArr:[]
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
  }
  },
};
import {
  relateDictList,
  faultdownlistDownload,
  faultList,
  faultDownload,
  faulthandleGrate,
  faulthandleList,
  handlegrateDownload,
  timeoutList,
  timeoutDownload
} from '../services/statistics';

export default {
  namespace: 'faultstatics',

  state: {
    handlingratedata:[],
    statusArr:[],
    faultArr:[],
    relatedictArr:[],
    faultdetailArr:[],
    timeoutArr:[]
  },

  effects: {
    // 故障统计查询页的列表
    *fetchrelateDictList({ payload }, { call, put }) {
      const response = yield call(relateDictList,payload);
      yield put ({
        type: 'relatedictArr',
        payload: response
      })
    },


    // 问题分类统计
    *fetchfaultlist({ payload }, { call, put }) {
      const response = yield call(faultList,payload);
      yield put ({
        type: 'faultArr',
        payload: response
      })
    },
     //  导出故障明细表
     * downloadFaultdetail({ payload }, { call }) {
       return yield call(faultDownload,payload);
     },
         // 导出故障汇总统计
    *downloadFaultdownlist({ payload }, { call }) {
      return yield call(faultdownlistDownload,  payload);
    },

     // 故障状态统计
     *fetchfaulthandle({ payload }, { call, put }) {
      const response = yield call(faulthandleGrate,payload);
      yield put ({
        type:'faultdetailArr',
        payload: response
      })
    },

     // 故障状态统计查询页面
     *fetchfaulthandleList({ payload }, { call, put }) {
      const response = yield call(faulthandleList,payload);
      yield put ({
        type:'relatedictArr',
        payload: response
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
       return yield call(timeoutDownload);
     }

    

  },

  reducers: {
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

  faultdetailArr(state,action) {
    return {
      ...state,
      faultdetailArr: action.payload.data
    }
  }
  },
};
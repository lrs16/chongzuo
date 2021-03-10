import {
  maintenanceList,
  eventServiceList,
  eventselfhandleList,
  eventtopnList,
  eventhandlerateList
} from '../services/statistics';

export default {
  namespace: 'eventstatistics',

  state: {
    maintenanceArr:[],
    maintenanceService:[],
    soluteArr:[],
    ordertopnArr:[],
    orderrateArr:[],
    eventServicearr:[],
  },

  effects: {
    // 运维分类情况统计列表
    *fetchMaintenancelist({ payload }, { call, put }) {
      const response = yield call(maintenanceList,payload);
      yield put ({
        type: 'maintenanceArr',
        payload: response
      })
    },

    // 运维服务指标统计列表
    *fetcheventServiceList({ payload }, { call, put }) {
      const response = yield call(eventServiceList,payload);
      yield put ({
        type: 'eventServicearr',
        payload: response
      })
    },

    // 一线事件解决情况列表
    *fetchSelfHandleList({ payload }, { call, put }) {
      const response = yield call(eventselfhandleList,payload);
      yield put ({
        type: 'soluteArr',
        payload: response
      })
    },
    // 工单TOPN统计列表
    *fetchordertopnList({ payload }, { call, put }) {
      const response = yield call(eventtopnList,payload);
      yield put ({
        type: 'ordertopnArr',
        payload: response
      })
    },
    // 工单处理率统计列表
    *fetchorderrateList({ payload }, { call, put }) {
      const response = yield call(eventhandlerateList,payload);
      yield put ({
        type: 'orderrateArr',
        payload: response
      })
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
  // 一线解决统计列表
  soluteArr(state, action) {
    return {
      ...state,
      soluteArr: action.payload.data
    }
  },
  // 工单TOPN统计列表
  ordertopnArr(state, action) {
    return {
      ...state,
      ordertopnArr: action.payload.data
    }
  },
  // 处理率统计列表
  orderrateArr(state, action) {
    return {
      ...state,
      orderrateArr: action.payload.data
    }
  },

  },
};
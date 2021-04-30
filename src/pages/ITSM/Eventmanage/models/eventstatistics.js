import {
  maintenanceList,
  eventServiceList,
  eventselfhandleList,
  eventtopnList,
  eventhandlerateList,
  maintenanceDownload,
  eventserviceDownload,
  eventselfhandleDownload,
  eventtopnDownload,
  eventhandlerateDownload,
  querkeyVal
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
    primaryObject:[]
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

    //  下载类
    //   下载运维分类情况统计
    *downloadMaintenance({payload},{ call, put }) {
      return yield call(maintenanceDownload, payload)
    },

    //   下载运维服务指标统计
    *downloadEventservice({payload},{ call, put }) {
      return yield call(eventserviceDownload, payload)
    },

    //   下载运维一线解决统计
    *downloadEventselfhandle({payload},{ call, put }) {
      return yield call(eventselfhandleDownload, payload)
    },

    //   下载topn统计
    *downloadEventtopn({payload},{ call, put }) {
      return yield call(eventtopnDownload, payload)
    },

    //   下载事件处理率
    *downloadEventhandlerate({payload},{ call, put }) {
      return yield call(eventhandlerateDownload, payload)
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
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
  getEventHandleRateList,
  downloadEventHandleRateListExcel,
  getHandlerTop,
  getHandleUnitTop,
  getObjectConditions,
  getOrderConditions,
  getRegisterUnitTop,
  getRegisterUserTop,
  getTimeOutConditions,
  getTypeConditions,
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
    primaryObject:[],
    eventHandleRatearr:[],

    getHandlerTopdata:[],
    getHandleUnitTopdata:[],
    getObjectConditionsdata:[],
    getOrderConditionsdata:[],
    getRegisterUnitTopdata:[],
    getRegisterUserTopdata:[],
    getTimeOutConditionsdata:[],
    getTypeConditionsdata:[],
    getTypeConditionsdatalineChart:[],
    getOrderConditionsobj:[],
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

     // 工单处理率详情列表
     *getEventHandleRateList({ payload }, { call, put }) {
      const response = yield call(getEventHandleRateList,payload);
      yield put ({
        type: 'eventHandleRatearr',
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

    //   下载工单处理率列表下载
    *downloadEventHandleRateListExcel({payload},{ call, put }) {
      return yield call(downloadEventHandleRateListExcel, payload)
    },

    // 可视化统计分析
     // // 事件处理人排名
     *fetchgetHandlerTop({ payload }, { call, put }) {
      const response = yield call(getHandlerTop,payload);
      yield put ({
        type: 'getHandlerTopdata',
        payload: response
      })
    },

     // // 事件事件分类总情况
     *fetchgetTypeConditions({ payload }, { call, put }) {
      const response = yield call(getTypeConditions,payload);
      yield put ({
        type: 'getTypeConditionsdata',
        payload: response
      })
    },

     // // 事件对象总情况
     *fetchgetObjectConditions({ payload }, { call, put }) {
      const response = yield call(getObjectConditions,payload);
      yield put ({
        type: 'getObjectConditionsdata',
        payload: response
      })
    },

     // // 事件工单超时情况
     *fetchgetTimeOutConditions({ payload }, { call, put }) {
      const response = yield call(getTimeOutConditions,payload);
      yield put ({
        type: 'getTimeOutConditionsdata',
        payload: response
      })
    },

     *fetchgetRegisterUserTop({ payload }, { call, put }) {
      const response = yield call(getRegisterUserTop,payload);
      yield put ({
        type: 'getRegisterUserTopdata',
        payload: response
      })
    },

     *fetchgetRegisterUnitTop({ payload }, { call, put }) {
      const response = yield call(getRegisterUnitTop,payload);
      yield put ({
        type: 'getRegisterUnitTopdata',
        payload: response
      })
    },

     *fetchgetHandleUnitTop({ payload }, { call, put }) {
      const response = yield call(getHandleUnitTop,payload);
      yield put ({
        type: 'getHandleUnitTopdata',
        payload: response
      })
    },

     *fetchgetOrderConditions({ payload }, { call, put }) {
      const response = yield call(getOrderConditions,payload);
      yield put ({
        type: 'getOrderConditionsobj',
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

  // 处理率统计详情页列表
  eventHandleRatearr(state, action) {
    return {
      ...state,
      eventHandleRatearr: action.payload.data
    }
  },

  getHandlerTopdata(state, action) {
    return {
      ...state,
      getHandlerTopdata: action.payload.data
    }
  },
  
  getTypeConditionsdata(state, action) {
    return {
      ...state,
      getTypeConditionsdata: action.payload.data
    }
  },
  
  getObjectConditionsdata(state, action) {
    return {
      ...state,
      getObjectConditionsdata: action.payload.data
    }
  },
  getTimeOutConditionsdata(state, action) {
    return {
      ...state,
      getTimeOutConditionsdata: action.payload.data
    }
  },
  getRegisterUserTopdata(state, action) {
    return {
      ...state,
      getRegisterUserTopdata: action.payload.data
    }
  },
  getHandlerTopdata(state, action) {
    return {
      ...state,
      getHandlerTopdata: action.payload.data
    }
  },
  getRegisterUnitTopdata(state, action) {
    return {
      ...state,
      getRegisterUnitTopdata: action.payload.data
    }
  },
  getHandleUnitTopdata(state, action) {
    return {
      ...state,
      getHandleUnitTopdata: action.payload.data
    }
  },
  getOrderConditionsobj(state, action) {
    return {
      ...state,
      getOrderConditionsobj: action.payload.data
    }
  },

  },
};
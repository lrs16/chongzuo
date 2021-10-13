import {
  statusList,
  statusDownload,
  classList,
  classDownload,
  handleGrate,
  handlegrateDownload,
  timeoutList,
  timeoutDownload,
  solvescheduleDownload,
  problemstatusList,
  statpieData,
  lineData,
  statratioData,
  statTop,
  resgisterstatTop,
  handlerstatTop,
  resgisterunitstatTop,
  handleunitstatTop
} from '../services/statistics';

export default {
  namespace: 'problemstatistics',

  state: {
    handlingratedata: [],
    statusArr: [],
    classArr: [],
    statusdetailList: [],
    timeoutArr: [],
    statpieArr: [],
    lineArr:[],
    statratioArr:[],
    statToparr:[],
    resgisterarr:[],
    handlerarr:[],
    resgisterunitarr:[],
    handlerunitarr:[]
  },

  effects: {
    // 问题状态列表
    *fetchstatusList({ payload }, { call, put }) {
      const response = yield call(statusList, payload);
      yield put({
        type: 'statusList',
        payload: response,
      });
    },

    // 问题状态下载
    *download({ payload }, { call }) {
      return yield call(statusDownload, payload);
    },

    // 问题分类统计
    *fetchClasslist({ payload }, { call, put }) {
      const response = yield call(classList, payload);
      yield put({
        type: 'classArr',
        payload: response,
      });
    },

    //  导出问题分类统计
    *downloadClass({ payload }, { call }) {
      return yield call(classDownload, payload);
    },

    // 问题解决管控表
    *handleLists({ payload }, { call, put }) {
      const response = yield call(handleGrate, payload);
      yield put({
        type: 'handlingratedata',
        payload: response,
      });
    },

    // 导出问题处理率
    *downloadHandlegrate({ payload }, { call }) {
      return yield call(handlegrateDownload);
    },

    // 超时统计列表
    *timeoutLists({ payload }, { call, put }) {
      const response = yield call(timeoutList, payload);
      yield put({
        type: 'timeoutData',
        payload: response,
      });
    },

    // 工单状态统计列表
    *statusDetaisdata({ payload }, { call, put }) {
      const response = yield call(problemstatusList, payload);
      yield put({
        type: 'statusdetailList',
        payload: response,
      });
    },
    // 导出超时统计
    *timeDownload({ payload }, { call, put }) {
      return yield call(timeoutDownload, payload);
    },
    // 导出问题工单解决进度管控统计结果

    *solveschedule({ payload }, { call, put }) {
      return yield call(solvescheduleDownload, payload);
    },

    //  饼图
    *fetchstatpieData({ payload }, { call, put }) {
      const response = yield call(statpieData, payload);
      yield put({
        type: 'statpieArr',
        payload: response,
      });
    },
    //  线图
    *fetchlineData({ payload }, { call, put }) {
      const response = yield call(lineData, payload);
      yield put({
        type: 'lineArr',
        payload: response,
      });
    },
    //  环比
    *fetchstatratioData({ payload }, { call, put }) {
      const response = yield call(statratioData, payload);
      yield put({
        type: 'statratioArr',
        payload: response,
      });
    },
    //  环比
    *fetchstatTop({ payload }, { call, put }) {
      const response = yield call(statTop, payload);
      yield put({
        type: 'statToparr',
        payload: response,
      });
    },
    //  问题统计分析登记人-TOP数据
    *fetchresgisterstatTop({ payload }, { call, put }) {
      const response = yield call(resgisterstatTop, payload);
      yield put({
        type: 'resgisterarr',
        payload: response,
      });
    },
    //   问题统计分析问题处理人Top5数据
    *fetchhandlerstatTop({ payload }, { call, put }) {
      const response = yield call(handlerstatTop, payload);
      yield put({
        type: 'handlerarr',
        payload: response,
      });
    },
    //  问题统计分析登记单位-TOP数据
    *fetchresgisterunitstatTop({ payload }, { call, put }) {
      const response = yield call(resgisterunitstatTop, payload);
      yield put({
        type: 'resgisterunitarr',
        payload: response,
      });
    },
    //   问题处理单位Top5
    *fetchhandleunitstatTop({ payload }, { call, put }) {
      const response = yield call(handleunitstatTop, payload);
      yield put({
        type: 'handlerunitarr',
        payload: response,
      });
    },
  },

  reducers: {
    // 问题状态列表
    statusList(state, action) {
      return {
        ...state,
        statusArr: action.payload.data,
      };
    },

    classArr(state, action) {
      return {
        ...state,
        classArr: action.payload.data,
      };
    },

    timeoutData(state, action) {
      return {
        ...state,
        timeoutArr: action.payload.data,
      };
    },

    statusdetailList(state, action) {
      return {
        ...state,
        statusdetailList: action.payload.data,
      };
    },

    handlingratedata(state, action) {
      return {
        ...state,
        handlingratedata: action.payload.data,
      };
    },

    statpieArr(state, action) {
      return {
        ...state,
        statpieArr: action.payload.data,
      };
    },
    lineArr(state, action) {
      return {
        ...state,
        lineArr: action.payload.data,
      };
    },
    statratioArr(state, action) {
      return {
        ...state,
        statratioArr: action.payload.data,
      };
    },
    statToparr(state, action) {
      return {
        ...state,
        statToparr: action.payload.data,
      };
    },
    resgisterarr(state, action) {
      return {
        ...state,
        resgisterarr: action.payload.data,
      };
    },
    handlerarr(state, action) {
      return {
        ...state,
        handlerarr: action.payload.data,
      };
    },
    resgisterunitarr(state, action) {
      return {
        ...state,
        resgisterunitarr: action.payload.data,
      };
    },
    handlerunitarr(state, action) {
      return {
        ...state,
        handlerunitarr: action.payload.data,
      };
    },
  },
};

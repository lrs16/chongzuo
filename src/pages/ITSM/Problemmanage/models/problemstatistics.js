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
  },
};

import {
  demandRequirementlist,
  demandstateList,
  requirementDownload,
  demandstateDownload,
  demandSchedulelist,
  demandTimeoutlist,
  demandscheduleDownload,
  demandtimeoutDownload,
  demandstatipieData, // 统计分析 -饼图
  demandstatilineData, // 统计分析 -趋势折线图
  demandstatiratioData, // 统计分析-工单情况
  demandTimeoutpieDate, // 需求超时(需求处理及时率)
  // demandstatidetailData, // 统计分析-工单明细-数据钻取
} from '../services/statisticapi';

export default {
  namespace: 'demandstatistic',

  state: {
    requirementArr: [],
    demandstateArr: [],
    demandscheduleArr: [],
    demandtomeoutArr: [],
    piedatalist: [], // 统计分析 -饼图
    linedatalist: [], // 统计分析 -趋势折线图
    ratiodatalist: [], // 统计分析 -工单数
    demandtimeoutpielist: [], // 需求超时(需求处理及时率)
    // demandquerylists: [], // 统计分析-工单明细-数据钻取
  },

  effects: {
    // 功能需求统计列表
    *fetchdemandRequirement({ payload }, { call, put }) {
      const response = yield call(demandRequirementlist, payload);
      yield put({
        type: 'requirementArr',
        payload: response
      })
    },
    // 需求状态统计列表
    *fetchdemandstateList({ payload }, { call, put }) {
      const response = yield call(demandstateList, payload);
      yield put({
        type: 'demandstateArr',
        payload: response
      })
    },

    // 需求进度统计列表
    *fetchdemandSchedulelist({ payload }, { call, put }) {
      const response = yield call(demandSchedulelist, payload);
      yield put({
        type: 'demandscheduleArr',
        payload: response
      })
    },
    // 需求超时统计列表
    *fetchdemandTimeoutlist({ payload }, { call, put }) {
      const response = yield call(demandTimeoutlist, payload);
      yield put({
        type: 'demandtomeoutArr',
        payload: response
      })
    },

    //   下载功能需求统计
    *downloadrequirement({ payload }, { call }) {
      return yield call(requirementDownload, payload)
    },
    //   下载需求状态统计
    *downloaddemandstate({ payload }, { call }) {
      return yield call(demandstateDownload, payload)
    },
    //   下载需求进度统计
    *downloaddemandSchedule({ payload }, { call }) {
      return yield call(demandscheduleDownload, payload)
    },
    //   需求超时导出
    *downloaddemandTimeout({ payload }, { call }) {
      return yield call(demandtimeoutDownload, payload)
    },

    // 统计分析
    // 统计分析饼图
    *getdemandstatipieData({ payload }, { call, put }) {
      yield put({
        type: 'clearcache'
      })
      const response = yield call(demandstatipieData, payload);
      yield put({
        type: 'demandpiedatalist',
        payload: response,
      });
    },

    // 统计分析趋势图
    *getdemandstatilineData({ payload }, { call, put }) {
      yield put({
        type: 'clearcache'
      })
      const response = yield call(demandstatilineData, payload);
      yield put({
        type: 'demandlinedatalist',
        payload: response,
      });
    },

    // 统计分析-工单数
    *getdemandstatiratioData({ payload }, { call, put }) {
      const response = yield call(demandstatiratioData, payload);
      yield put({
        type: 'demandratiodatalist',
        payload: response,
      });
    },

    // 需求超时(需求处理及时率)
    *getdemandTimeoutpieDate({ payload }, { call, put }) {
      const response = yield call(demandTimeoutpieDate, payload);
      yield put({
        type: 'demandtimeout',
        payload: response
      })
    },

    // 需求统计分析-工单明细-数据钻取
    // *getdemandstatidetailData({ payload }, { call, put }) {
    //   yield put({
    //     type: 'clearcache'
    //   })
    //   const response = yield call(demandstatidetailData, payload);
    //   yield put({
    //     type: 'demandquerylist',
    //     payload: response,
    //   });
    // },

  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        piedatalist: [], // 统计分析 -饼图
        linedatalist: [], // 统计分析 -趋势折线图
        demandtimeoutpielist: [] // 需求超时(需求处理及时率)
        // demandquerylists: [], // 统计分析-工单明细
      }
    },
    // 功能需求统计列表
    requirementArr(state, action) {
      return {
        ...state,
        requirementArr: action.payload.data
      }
    },

    // 需求状态统计列表
    demandstateArr(state, action) {
      return {
        ...state,
        demandstateArr: action.payload.data
      }
    },
    // 需求进度统计列表
    demandscheduleArr(state, action) {
      return {
        ...state,
        demandscheduleArr: action.payload.data
      }
    },
    // 需求超时统计列表
    demandtomeoutArr(state, action) {
      return {
        ...state,
        demandtomeoutArr: action.payload.data
      }
    },
    // 统计分析 -饼图
    demandpiedatalist(state, action) {
      return {
        ...state,
        piedatalist: action.payload.data,
      };
    },
    // 统计分析 -趋势折线图
    demandlinedatalist(state, action) {
      return {
        ...state,
        linedatalist: action.payload.data,
      };
    },

    // 统计分析-工单数
    demandratiodatalist(state, action) {
      return {
        ...state,
        ratiodatalist: action.payload.data,
      };
    },
    // 需求超时(需求处理及时率)
    demandtimeout(state, action) {
      return {
        ...state,
        demandtimeoutpielist: action.payload.data
      }
    },

    // 统计分析-工单明细
    // demandquerylist(state, action) {
    //   return {
    //     ...state,
    //     demandquerylists: action.payload.data,
    //   };
    // },
  },
};
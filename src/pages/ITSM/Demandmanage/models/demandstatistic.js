import {
  demandRequirementlist,
  demandstateList,
  requirementDownload,
  demandstateDownload
} from '../services/statisticapi';

export default {
  namespace: 'demandstatistic',

  state: {
    requirementArr:[],
    demandstateArr:[]
  },

  effects: {
    // 功能需求统计列表
    *fetchdemandRequirement({ payload }, { call, put }) {
      const response = yield call(demandRequirementlist,payload);
      yield put ({
        type: 'requirementArr',
        payload: response
      })
    },
    // 需求状态统计列表
    *fetchdemandstateList({ payload }, { call, put }) {
      const response = yield call(demandstateList,payload);
      yield put ({
        type: 'demandstateArr',
        payload: response
      })
    },

     //   下载功能需求统计
     *downloadrequirement({payload},{ call, put }) {
      return yield call(requirementDownload, payload)
    },
     //   下载需求状态统计
     *downloaddemandstate({payload},{ call, put }) {
      return yield call(demandstateDownload, payload)
    },

  },

  reducers: {
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

  },
};
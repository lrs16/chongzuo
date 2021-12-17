import {
  getEventList,
  getTroubleList,
  getProblemList,
  queryOrderRelationList,
  saveRelation,
  getReleaseList,
  saveRelationrelease,
  relationlist,
  relationReleaseLists,
  getDemandList,
  getOperationList,
  assessSearch,
  qualitySearch
} from '@/services/common';
import { message } from 'antd';

export default {
  namespace: "relationorder",
  state: {
    list: [],
    order: [],
    statuscode: ''
  },

  effects: {
    * fetcht({ payload }, { put, call }) {
      yield put({
        type: "clearlist",
      });
      const response = yield call(queryOrderRelationList, payload);
      yield put({
        type: "save",
        payload: response.data
      })
    },
    * relesefetcht({ payload }, { put, call }) {
      const response = yield call(relationlist, payload);
      yield put({
        type: "save",
        payload: response.data
      })
    },

    * saverelation({ payload }, { call, put }) {
      const response = yield call(saveRelation, payload);
      if (response.code === 200) {
        message.success(response.msg)
        yield put({
          type: "savecode",
          payload: response.code
        })
      } else {
        message.error(response.msg)
      }
    },

    // 保存发布
    * saveelease({ payload }, { put, call }) {
      return yield call(saveRelationrelease, payload);

    },
    // 弹窗获取事件列表
    * fetchevent({ payload }, { put, call }) {
      const response = yield call(getEventList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },
    // 弹窗获取故障列表
    * fetchtrouble({ payload }, { put, call }) {
      const response = yield call(getTroubleList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },
    // 弹窗获取问题
    * fetchproblem({ payload }, { put, call }) {
      const response = yield call(getProblemList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },
    // 弹窗获取需求
    * fetchdemand({ payload }, { put, call }) {
      const response = yield call(getDemandList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },

    // 弹窗获取作业计划
    * fetchoperation({ payload }, { put, call }) {
      const response = yield call(getOperationList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },

    // 弹窗获取服务绩效
    * fetchquality({ payload }, { put, call }) {
      const response = yield call(assessSearch, payload);
      yield put({
        type: "saveorder",
        payload: { total: response.data.total, rows: response.data.records }
      })
    },

    *fetchlist({ payload }, { call, put }) {
      const response = yield call(getReleaseList, payload);
      yield put({
        type: 'saveorder',
        payload: response.data,
      });
    },
    // 弹窗获取发布单
    * fetchrelease({ payload }, { put, call }) {
      const response = yield call(relationReleaseLists, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },

    * fetchDemandList({ payload }, { put, call }) {
      const response = yield call(getDemandList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },

     // 问题弹窗获取服务绩效
     * fetchqualitySearch({ payload }, { put, call }) {
     const response = yield call(qualitySearch, payload);
     yield put({
       type: "saveorder",
       payload: { total: response.data.total, rows: response.data.records }
     })
   },
  },

  reducers: {
    clearlist(state) {
      return {
        ...state,
        list: [],
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload || [],
        statuscode: '',
      };
    },
    saveorder(state, action) {
      return {
        ...state,
        order: action.payload,
        statuscode: '',
      };
    },
    savecode(state, action) {
      return {
        ...state,
        statuscode: action.payload,
      };
    },
  },

}
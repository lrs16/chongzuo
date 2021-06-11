import { getEventList, getTroubleList, getProblemList, queryOrderRelationList, saveRelation } from '@/services/common';
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
      const response = yield call(queryOrderRelationList, payload);
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

    * fetchevent({ payload }, { put, call }) {
      const response = yield call(getEventList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },

    * fetchtrouble({ payload }, { put, call }) {
      const response = yield call(getTroubleList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },

    * fetchproblem({ payload }, { put, call }) {
      const response = yield call(getProblemList, payload);
      yield put({
        type: "saveorder",
        payload: response.data
      })
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload || [],
      };
    },
    saveorder(state, action) {
      return {
        ...state,
        order: action.payload,
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
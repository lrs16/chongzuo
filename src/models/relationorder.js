import { getTroubleList, getProblemList, queryOrderRelationList, saveRelation } from '@/services/common';

export default {
  namespace: "relationorder",
  state: {
    list: [],
    order: [],
  },

  effects: {
    * fetcht({ payload }, { put, call }) {
      const response = yield call(queryOrderRelationList, payload);
      console.log(response)
      yield put({
        type: "save",
        payload: response.data.rows
      })
    },

    * saverelation({ payload }, { call }) {
      const response = yield call(saveRelation, payload);
      if (response.code === 200) {
        console.log('保存')
      }
    },

    * fetchtrouble({ payload }, { put, call }) {
      const response = yield call(getTroubleList, payload);
      yield put({
        type: "saveorder",
        payload: response.data.rows
      })
    },

    * fetchproblem({ payload }, { put, call }) {
      const response = yield call(getProblemList, payload);
      yield put({
        type: "saveorder",
        payload: response.data.rows
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
  },

}
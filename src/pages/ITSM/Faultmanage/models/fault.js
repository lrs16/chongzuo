import {
  queryfaultTodoList, // 故障待办list
  queryfaultSearchList, // 故障查询list
  queryFaultDetailList, // 故障明细list
} from '../services/api';

export default {
  namespace: 'fault',

  state: {
    todolist: [],
    faultquerydata: [],
    getfaultBreakdownList: [],
  },

  effects: {
      *fetchfaultTodoList({ payload }, { call, put }) { // 故障待办list
          const response = yield call(queryfaultTodoList, payload);
          yield put({
            type: 'show',
            payload: response.data,
          });
      },

      *fetchfaultSearchList({ payload }, { call, put }) { // 故障查询list
          const response = yield call(queryfaultSearchList, payload);
          yield put({
            type: 'faultquerydata',
            payload: response.data,
          });
      },

      *fetchfaultBreakdownList({ payload }, { call, put }) { // 故障明细表list
        const response = yield call(queryFaultDetailList, payload);
        yield put({
          type: 'getfaultBreakdownList',
          payload: response.data,
        });
      },

  },

  reducers: {
      show(state, action) {
          return {
              ...state,
              todolist: action.payload,
          }
      },

      faultquerydata(state, action) {
          return {
              ...state,
              faultquerydata: action.payload,
          }
      },

      getfaultBreakdownList(state, action) { // 故障明细表list
        return {
          ...state,
          getfaultBreakdownList: action.payload,
        };
      },
  },
};

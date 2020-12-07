import {
    queryfaultTodoList, // 故障待办list
    queryfaultSearchList, // 故障查询list
  } from '../services/api';
  
  export default {
    namespace: 'fault',
  
    state: {
      todolist: [],
      faultquerydata: [],
    },
  
    effects: {
        *fetchfaultTodoList({ payload }, { call, put }) { // 故障待办list
            const response = yield call(queryfaultTodoList, payload);
            yield put({
              type: 'show',
              payload: response,
            });
        },

        *fetchfaultSearchList({ payload }, { call, put }) { // 故障查询list
            const response = yield call(queryfaultSearchList, payload);
            yield put({
              type: 'faultquerydata',
              payload: response,
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
    },
  };
  
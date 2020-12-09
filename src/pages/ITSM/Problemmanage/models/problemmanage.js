import {
  problemList,
  besolveList
} from '../services/api';

export default {
  namespace: 'problemmanage',

  state: {
    list:[],
    besolveList:[]
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(problemList);
      yield put({
        type: 'getlist',
        payload: response,
      });
    },

    //  待办
    *besolveList({ payload }, { call, put }) {
      const response = yield call(besolveList);
      yield put ({
        type:'besolveList1',
        payload: response.data
      })
    }

  },

  reducers: {
    getlist(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

    besolveList1(state, action) {
      return {
        ...state,
        besolveList :action.payload
      }
    }
    
  },
};

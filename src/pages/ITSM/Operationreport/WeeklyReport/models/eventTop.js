import route from 'umi/router';
import {
  eventtopnList,
} from '../services/softreportapi';

export default {
  namespace:'eventTop', // 防止刷新把数据暂存的数据丢失

  state: {
    ordertopnArr:[],
  },

  effects: {  
      // 工单TOPN统计列表
      *fetchordertopnList({ payload }, { call, put }) {
      const response = yield call(eventtopnList,payload);
      yield put ({
        type: 'ordertopnArr',
        payload: response
      })
    },
  
  },


  reducers:{
      // 工单TOPN统计列表
    ordertopnArr(state, action) {
      return {
        ...state,
        ordertopnArr: action.payload.data
      }
    },

  }
}
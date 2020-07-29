import {
  queryScriptlist,
  queryScriptinfo,
  AddScript,
  editScript,
  removeScript,
} from '../services/api';

export default {
  namespace: 'scriptmanage',

  state: {
    data: [],
    info: [],
  },

  effects: {
    // mock脚本列表接口
    // *fetch({ payload }, { call, put }) {
    //   const response = yield call(queryScripts, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    *fetch({ payload: { limit, pages } }, { call, put }) {
      const response = yield call(queryScriptlist, limit, pages);
      yield put({
        type: 'getData',
        payload: response,
      });
    },
    *fetchinfo({ payload: { id } }, { call, put }) {
      const response = yield call(queryScriptinfo, id);
      yield put({
        type: 'getinfo',
        payload: response,
      });
    },
    // 添加
    *add({ payload }, { call }) {
      return yield call(AddScript, payload);
      // console.log(payload);
    },
    *edit({ payload: { id, value } }, { call }) {
      return yield call(editScript, id, value);
      // console.log(id,value);
    },
    *remove({ payload }, { call }) {
      return yield call(removeScript, payload);
      // console.log(payload);
    },
  },
  // subscriptions:{
  //     setup({dispatch, history}){
  //       return history.listen(({pathname}) => {
  //         if(pathname === "/automation/scriptmanage"){
  //             dispatch{type:fetch}
  //         }
  //       })
  //     }

  // },

  reducers: {
    getData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    getinfo(state, action) {
      return {
        ...state,
        info: action.payload.data,
      };
    },
  },
};

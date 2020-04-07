import { queryScriptlist,AddScript,editScript,removeScript } from '../services/api';

export default {
  namespace: 'scriptmanage',

  state: {
    data:[],
    pageNumberInit:'',
    pageSizeInit:'',
  },

  effects: {
    // *fetch({ payload }, { call, put }) {
    //   const response = yield call(queryScripts, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    *fetch({payload: {pageNumberInit,pageSizeInit} }, { call, put}) {
      // const pageSizeInit = yield select(state.scriptmanage.pageSizeInit);
      // console.log(pageNumberInit, pageSizeInit);
      const response = yield call(queryScriptlist,pageNumberInit, pageSizeInit);
      // console.log(response);
      yield put({
        type: 'getData',
        payload: response,
      });
    },
    // 添加
    *add({ payload, }, { call}) {
     return yield call(AddScript,payload);
      // console.log(payload);
    },
    *edit({ payload:{id, value} }, { call}) {
      return yield call(editScript,id,value);
      // console.log(id,value);
    },
    *remove({ payload}, { call}) {
      return yield call(removeScript,payload);
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
  },
};
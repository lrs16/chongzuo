import {
  saveForm,
  myTasklist
} from '../services/processapi';

const replacerec = values => {
  const newarr = JSON.parse(
    JSON.stringify(values)
      .replace(/main_/g, 'main.')
      .replace(/check_/g, 'check.')
      .replace(/execute_/g, 'execute.'),
  );
  return newarr;
};

export default {
  namespace:'processmodel',

  state: {
    checkList:[],
    myTaskplanlist:[]
  },

  effects: {
    *savesaveForm({ payload }, { call, put }) {
      const values= replacerec(payload);
      console.log('values: ', values);
      return yield call(saveForm,values)
    },
    //  我的作业计划列表
    *myTasklist({ payload }, { call, put }) {
      const response = yield call(myTasklist,payload);
      yield put ({
        type:'myTaskplanlist',
        payload: response
      })
    },

  },

  reducers: {
    myTaskplanlist(state,action) {
      return {
        ...state,
        myTaskplanlist: action.payload
      }
    }

  }
}
import {
  configList,
  saveCommandlist,
  updateCommand,
  deleteCommand,
  editSearchinfo
} from '../services/api';
export default {
  namespace: 'commandconfigurate',

  state: {
    data: [],
    editInfo:[]
  },

  effects: {

    *fetch({ payload }, { call, put }) {
      const response = yield call(configList, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    
    *addSave({ payload }, { call, put }) {
      return yield call(saveCommandlist,payload);
    },

    *updateCommand({ payload }, { call }) {
      return yield call(updateCommand, payload);
    },

    *deleteCommand({payload:{id}}, { call }) {
      console.log({id},'{}');
      return yield call(deleteCommand,id);
    },

    *editSearchinfo({payload:{id}}, { call }) {
      return yield call(editSearchinfo,id);
      // yield put({
      //   type: 'edit',
      //   payload: response,
      // });
  },
},

  reducers: {
    show(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },

    // edit(state, action) {
    //   return {
    //     ...state,
    //     editInfo: action.payload
    //   }
    // },
  }
};
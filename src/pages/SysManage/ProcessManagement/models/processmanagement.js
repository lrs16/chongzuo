import {
  searchModels,
  saveModels,
  deleteModels,
  editModels,
  releaseModels,
  definitionList,
  imgResource,
  deleteDefinition,
  stateChange
} from '../services/api';

export default {
  namespace: 'processmanagement',

  state: {
    list:[],
    editInfo:[],
    definitionList:[]
  },

  effects: {
    // 列表
    *fetchlist({ payload }, { call, put }) {
      const response = yield call(searchModels, payload);
      yield put({
        type: 'getlist',
        payload: response,
      });
    },

    *modelSave({ payload }, { call }) {
      return yield call(saveModels, payload);
    },

    *modelDelete({ payload: { id }}, { call }) {
      return yield call(deleteModels,id)
    },

    *editModels({ payload: { id }}, { call, put }) {
    //  return yield call(editModels,id);
    const response = yield call(editModels,id);
    yield put ({
      type:'html',
      payload: response
    })
    
    },

    *releaseModels({ payload: { modelId }}, { call }) {
      return yield call(releaseModels,modelId)
    },

    *definitionList({ payload:{ page,limit,bodyParams }},{ call, put}) {
      const response = yield call(definitionList, page,limit,bodyParams);
      yield put ({
        type: 'definitionlist',
        payload: response
        }
      )
    },

    *imgResource({ payload:{id,resourceName}}, { call }) {
      return yield call(imgResource,id,resourceName);
    },

    *deleteDefinition({ payload: { id }}, { call }) {
      return yield call(deleteDefinition, id);
    },

    *stateChange({ payload: {id,suspendState}},{call}) {
      return yield call(stateChange,id,suspendState);
    }
  },

  reducers: {
    getlist(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },

    definitionlist(state, action) {
      return {
        ...state,
        list: action.payload.data,
      }
    }
    
  },
};

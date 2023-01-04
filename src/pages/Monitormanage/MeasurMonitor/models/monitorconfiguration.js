import { 
  configurationList,
  saveConfiguration,
  configurationDetail,
  batchsaveConfiguration,
  instructionList,
  instructionSearch
 } from '../services/monitor';

export default {
  namespace: 'monitorconfiguration',

  state: {
    detailArr: [],
    instructionArr:[]
  },

  effects: {
    // 监控配置列表
    *fetch({ payload }, { call, put }) {
      return yield call(configurationList, payload);
    },
    // 表格编辑保存接口
    *saveConfigura({ payload }, { call, put }) {
      return yield call(saveConfiguration, payload);
    },
    // 表格的详情接口
    *detailConfigura({ payload:{code,newtitle} }, { call, put }) {
      return yield call(configurationDetail, code,newtitle);
    },
    //  详情页表格批量保存
    *batchSave({ payload }, { call, put }) {
      return yield call(batchsaveConfiguration, payload);
    },
    //  监控指令表格
    *fetchinstructionList({ payload }, { call, put }) {
      const response = yield call(instructionList,payload);
      yield put({
        type: 'instructionArr',
        payload: response,
      });
    },

  //   //  监控指令搜索
    *searchInstruction({ payload }, { call, put }) {
      const response = yield call(instructionSearch,payload);
      yield put({
        type: 'instructionArr',
        payload: response,
      });
    }
  },

  reducers: {
    getcomplete(state, action) {
      return {
        ...state,
        complete: action.payload,
      };
    },

    instructionArr(state, action) {
      return {
        ...state,
        instructionArr: action.payload.data,
      };
    },
  },
};

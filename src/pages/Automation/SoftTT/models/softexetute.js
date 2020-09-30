import { queryHostShh2, queryHostShh2Search, queryHostShh2List, queryExecLog, queryExecLogDetail, queryHostShh2ExecCommand, queryHostEncryptStr } from '../services/api';
// import mockjs from 'mockjs';

const jxreq = {
  des: '456456456456456123123123',
};
export default {
  namespace: 'softexetute',

  state: {
    list: [],
    des: '',
    execloglist: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHostShh2List, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    
    *submitData({put }) {
      // const response = yield call(querySoftExetute, payload);
      const response = jxreq;
      yield put({
        type: 'savesubmit',
        payload: response,
      });
    },
    // 软件启停-主机_SSH2管理 新建
    *newuserInfo({ payload }, { call }) {
      return yield call(queryHostShh2, payload);
    },
    // 软件启停-主机_SSH2管理 查询
    *getByUserNameAndIp({ payload }, { call }) {
      return yield call(queryHostShh2Search, payload);
    },
    // 软件启停-主机_SSH2管理 执行命令
    *getExecCommand({ payload }, { call }) {
      return yield call(queryHostShh2ExecCommand, payload);
    },
    *getExeclogList({ payload }, { call, put }) {
      const response = yield call(queryExecLog, payload);
      yield put({
        type: 'execloglist',
        payload: response,
      });
    },
    *getExeclogListDEtail({ payload: { id } }, { call}) {
      return yield call(queryExecLogDetail, id);
    },
    *getHostEncryptStr({ payload: { encryptStr } }, { call}) {
      return yield call(queryHostEncryptStr, encryptStr);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

    savesubmit(state, action) {
      return {
        ...state,
        des: action.payload,
      };
    },

    execloglist(state, action) {
      return {
        ...state,
        execloglist: action.payload.data,
      };
    },
  },
};

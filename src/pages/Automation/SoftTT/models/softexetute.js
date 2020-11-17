import {
  queryHostShh2,
  queryHostShh2Search,
  queryHostShh2List,
  queryExecLog,
  queryExecLogDetail,
  queryHostShh2ExecCommand,
  queryHostEncryptStr,
  querySearchSofts,
  querySoftwaresList,
  queryToHostList, // 树杈数据
  queryHostTree,
  querySofttoHostHandleType,
  querySshInfoList, // SSh信息表格
  searchSshInfotoEdit, // SSh信息表格编辑数据填充
  editeSshInfoList,// SSh信息表格编辑
  addSshInfoList,// SSh信息表格添加
  removeSshInfoList,
  queryCheckSshLink, // 检测链接
  querySecretThief, // 查看密码
  queryCascadeInfo, // 级联-主机Ip用户名端口命令等下拉列表
  queryComConfigTree, // 命令树形信息
} from '../services/api';

export default {
  namespace: 'softexetute',

  state: {
    list: [],
    softdata: [], // 软件数据
    execloglist: [],
    treesoftdata: [],
    treehostdata: [],
    data: [],
    sshinfodata: [], // SSh信息表格
    comconfigtree: [], // 命令树形信息
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHostShh2List, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    // 软件的接口
    *fetchsoft({ payload }, { call, put }) {
      const response = yield call(querySearchSofts, payload);
      yield put({
        type: 'softlist',
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

    *getExeclogListDEtail({ payload: { id } }, { call }) {
      return yield call(queryExecLogDetail, id);
    },

    *getHostEncryptStr({ payload: { encryptStr } }, { call }) {
      return yield call(queryHostEncryptStr, encryptStr);
    },

    *getSoftwaresList({ payload: { hostId } }, { call, put }) {
      const response = yield call(querySoftwaresList, hostId);
      yield put({
        type: 'treesoftdata',
        payload: response.data,
      });
    },

    *getToHostList({ payload: { hostId } }, { call, put }) {
      const response = yield call(queryToHostList, hostId);
      yield put({
        type: 'treehostdata',
        payload: response.data,
      });
    },

    *fetchHostTree({ payload }, { call, put }) { // 主机树杈
      const response = yield call(queryHostTree, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },

    *fetchComConfigTree({ payload }, { call, put }) { // 命令信息树杈
      const response = yield call(queryComConfigTree, payload);
      yield put({
        type: 'comconfigtree',
        payload: response,
      });
    },

    *getSofttoHostHandleType({ payload: { hostsId, softId, handleType } }, { call }) {
      return yield call(querySofttoHostHandleType, { hostsId, softId, handleType });
    },

    *getSshInfoList({ payload }, { call, put }) { // SSh信息表格数据
      const response = yield call(querySshInfoList, payload);
      yield put({
        type: 'sshinfodata',
        payload: response,
      });
    },

    // SSh信息表格数据编辑填充
    *searchSshInfotoEdit({ payload: { id } }, { call }) {
      // const response = yield call(searchSshInfoList, id);
      // yield put({
      //   type: 'newSshInfoList',
      //   payload: response,
      // });
      return yield call(searchSshInfotoEdit, id);
    },

    // 编辑SSh信息表格数据
    *edite({ payload }, { call }) {
      return yield call(editeSshInfoList, payload);
    },

    // // 添加SSh信息表格数据
    *add({ payload }, { call }) {
      return yield call(addSshInfoList, payload);
    },

    // 删除SSh信息表格数据
    *remove({ payload: { id } }, { call }) {
      return yield call(removeSshInfoList, id);
    },

    // ssh查看密码/检测链接
    *getCheckSshLink({ payload: { id } }, { call }) {
      return yield call(queryCheckSshLink, id);
    },
    *getSecretThief({ payload: { id } }, { call }) {
      return yield call(querySecretThief, id);
    },

    *getCascadeInfoLists({ payload: { hostIp } }, { call }) {
      return yield call(queryCascadeInfo, hostIp);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.data,
      };
    },

    softlist(state, action) {
      return {
        ...state,
        softdata: action.payload.data,
      };
    },

    execloglist(state, action) {
      return {
        ...state,
        execloglist: action.payload.data,
      };
    },

    treesoftdata(state, action) {
      return {
        ...state,
        treesoftdata: action.payload,
      };
    },

    treehostdata(state, action) {
      return {
        ...state,
        treehostdata: action.payload,
      };
    },

    sshinfodata(state, action) {
      return {
        ...state,
        sshinfodata: action.payload.data,
      };
    },

    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    comconfigtree(state, action) {
      return {
        ...state,
        comconfigtree: action.payload.data,
      };
    },

    // newSshInfoList(state, action) {
    //   return {
    //     ...state,
    //     newSshInfoList: action.payload,
    //   };
    // },
  },
};

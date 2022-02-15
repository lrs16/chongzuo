import { message } from 'antd';
import router from 'umi/router';
import {
  orderList,
  openOrder,
  getNextFlowUserList,
  toSubmit,
} from '../services/temp';

const closeTab = () => {
  const tabid = sessionStorage.getItem('tabid');
  router.push({
    pathname: `/ITSM/releasemanage/temporary/list`,
    query: { pathpush: true },
    state: { cach: false, closetabid: tabid }
  });
}

// const toSubmit = (subres) => {
//   if (subres.code === 200) {
//     message.success('操作成功');
//   } else {
//     message.error(subres.res);
//   };
//   closeTab();
// };

export default {
  namespace: 'releasetemp',

  state: {
    list: {},
    info: undefined,
    statuse: -1,
    userlist: undefined,
  },

  effects: {
    // 清除state
    *cleardata(_, { put }) {
      yield put({
        type: 'clearcache',
      });
    },

    // 列表
    *fetchlist({ payload }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(orderList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    // 打开待办
    *openflow({ payload: { releaseNo } }, { call, put }) {
      yield put({
        type: 'clearcache',
      });
      const response = yield call(openOrder, releaseNo);
      if (response.code === 200) {
        yield put({
          type: 'saveinfo',
          payload: {
            info: response.data,
          },
        });
      } else {
        message.error(response.msg)
      };
    },

    // 选择下一环节处理人
    *getuserlist({ payload }, { call, put }) {
      const response = yield call(getNextFlowUserList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveuserlist',
          payload: {
            userlist: response.data,
          },
        });
      } else {
        message.error(response.msg)
      };
    },

    // 通用流转,回退
    *releaseflow({ payload }, { call }) {
      const subres = yield call(toSubmit, payload);
      if (subres.code === 200) {
        message.success('操作成功');
      } else {
        message.error(subres.msg);
      };
      closeTab();
    },

  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
        info: undefined,
        statuse: -1,
        userlist: undefined,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload || {},
      };
    },
    saveinfo(state, action) {
      return {
        ...state,
        info: action.payload.info || {},
      };
    },
    savestatuse(state, action) {
      return {
        ...state,
        statuse: action.payload.statuse,
      };
    },
    saveuserlist(state, action) {
      return {
        ...state,
        userlist: action.payload.userlist,
      };
    },
  },
};

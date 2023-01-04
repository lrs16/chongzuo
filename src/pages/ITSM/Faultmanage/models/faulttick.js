import { message } from 'antd';
import router from 'umi/router';
import { repairList, openRepairFlow, toSubmit } from '../services/tick';

const closeTab = () => {
  const tabid = sessionStorage.getItem('tabid');
  router.push({
    pathname: `/ITSM/faultmanage/tickemergent/list`,
    query: { pathpush: true },
    state: { cach: false, closetabid: tabid },
  });
};

export default {
  namespace: 'tickemergent',

  state: {
    list: {},
    info: undefined,
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
      const response = yield call(repairList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    // 打开待办
    *openflow({ payload: { mainId, taskId, clear, todo } }, { call, put }) {
      if (clear) {
        yield put({
          type: 'clearcache',
        });
      }
      const response = yield call(openRepairFlow, mainId, taskId, todo);
      if (response.code === 200) {
        yield put({
          type: 'saveinfo',
          payload: {
            info: response.data,
          },
        });
      } else {
        message.error(response.msg);
      }
    },

    // 登记提交
    *repairSubmit({ payload }, { call }) {
      const subres = yield call(toSubmit, payload);
      if (subres.code === 200) {
        message.success('操作成功');
      } else {
        message.error(subres.msg);
      }
      closeTab();
    },
  },

  reducers: {
    clearcache(state) {
      return {
        ...state,
        list: {},
        info: undefined,
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
  },
};

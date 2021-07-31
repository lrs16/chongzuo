import { message } from 'antd';
import router from 'umi/router';
import { saveRegister, flowSubmit } from '../services/api';

export default {
  namespace: 'releaseregistra',

  state: {
    info: {}
  },

  effects: {
    // 登记保存或提交
    *fetchsubmit({ payload }, { call }) {
      const tabid = sessionStorage.getItem('tabid');
      const subres = yield call(flowSubmit, payload);
      if (subres.code === 200) {
        router.push({
          pathname: `/ITSM/releasemanage/registration`,
          query: { tabid, closecurrent: true }
        });
        router.push({
          pathname: `/ITSM/releasemanage/to-do`,
          query: { pathpush: true },
          state: { cach: false, }
        });
      } else {
        message.error(subres.msg)
      }
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        info: action.payload || {},
      };
    },
  },
};

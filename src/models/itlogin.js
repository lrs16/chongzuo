import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { ITSMLogin } from '@/services/login';
import { queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'itlogin',
  state: {
    status: '',
    msg: '',
    currentAuthority: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(ITSMLogin, payload);
      if (response.code === -1) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setTimeout(() => {
          window.opener = null;
          window.open(' ', '_self');
          window.close();
        }, 2500);
      }

      if (response.code === 200) {
        sessionStorage.setItem('access_token', response.data.access_token);
        const userinfo = yield call(queryCurrent); // 正式环境
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: userinfo.data.loginCode,
            // currentAuthority: response.currentAuthority,
            response,
          },
        });

        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.response.code,
        msg: payload.response.msg,
      };
    },
  },
};
export default Model;

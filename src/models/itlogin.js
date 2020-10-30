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
        }, 6000);
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
        const urlParams = new URL(window.location.href); // 本地记录路由
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.code,
        msg: payload.msg,
      };
    },
  },
};
export default Model;

import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha, fakeLogout } from '@/services/login';
import { queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    code: '',
    currentAuthority: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      sessionStorage.setItem('access_token', response.data.access_token);
      // sessionStorage.setItem('refresh_token', response.data.refresh_token);  //正式环境
      // sessionStorage.setItem('expires_in', response.data.expires_in);        //正式环境
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: response,
      // }); // Login successfully

      if (response.code === 200) {
        const userinfo = yield call(queryCurrent);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: userinfo.data.loginCode,
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

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ payload: { access_token } }, { call, put }) {
      // console.log(payload);
      sessionStorage.clear();
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
      return yield call(fakeLogout, access_token);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      // setAuthority('admin')
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;

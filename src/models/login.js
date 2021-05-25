import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha, fakeLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: '',
    msg: '',
    currentAuthority: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { logincode } = payload;
      const response = yield call(fakeAccountLogin, payload);

      if (response.code === -1) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
      }

      if (response.code === 200) {
        sessionStorage.setItem('access_token', response.data.access_token);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: logincode,
            // currentAuthority: response.currentAuthority,
            response,
          },
        });
        // const urlParams = new URL(window.location.href); // 本地记录路由
        // const params = getPageQuery();
        // let { redirect } = params;
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);

        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);

        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = '/';
        //     return;
        //   }
        // }

        yield put(routerRedux.replace('/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ payload: { access_token } }, { call, put }) {
      // console.log(payload);
      sessionStorage.clear();
      // const { redirect } = getPageQuery(); // redirect
      if (window.location.pathname !== '/user/login') {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            // search: stringify({
            //   redirect: window.location.href,
            // }),
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
      return {
        ...state,
        status: payload.code,
        // type: payload.type,
        msg: payload.msg,
      };
    },

    // errstatus(state, action) {
    //   return {
    //     ...state,
    //     errs: action.payload,
    //   };
    // },
  },
};
export default Model;

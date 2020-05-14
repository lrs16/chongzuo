import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { notification } from 'antd';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'userlogin',

  state: {
    status: undefined,
    currentAuthority: '',
    code: '',
  },

  effects: {
    *login({ payload }, { call, put, select }) {
      // 使用call（function，param）获取后台数据，后台返回结果存储在 response 里
      const response = yield call(fakeAccountLogin, payload); // yield call(调用后台接口的方法，传过去的参数)
      sessionStorage.setItem('access_token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      sessionStorage.setItem('expires_in', response.data.expires_in);
      const loginCode = yield select(state => state.user.currentUser.loginCode);

      // 获取服务端返回，存储数据
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: loginCode,
          response,
        },
      });
      // 登入成功
      if (response.code === 200) {
        reloadAuthorized(); // 加载权限
        const urlParams = new URL(window.location.href); // 本地记录路由
        const params = getPageQuery(); // 获取参数
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (window.routerBase !== '/') {
              redirect = redirect.replace(window.routerBase, '/');
            }
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/')); // 路由跳转
      } else {
        notification.error({
          message: '登录失败，请重新登录。',
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    // 退出登录
    *logout(_, { put }) {
      sessionStorage.clear(); // sessionStorage
      // sessionStorage .removeItem('access_token')
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
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
    },
  },

  reducers: {
    // 保存权限
    changeLoginStatus(state, { payload }) {
      // 本地登录权限认证
      setAuthority(payload.currentAuthority);
      return {
        // 本地 state 数据状态更新
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

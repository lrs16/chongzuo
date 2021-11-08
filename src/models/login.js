import { routerRedux } from 'dva/router';
// import { notification, Icon } from 'antd';
import Base64 from 'base-64';
import JSEncrypt from 'jsencrypt';
// import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha, fakeLogout, getSerialNumberKey } from '@/services/login';
import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: '',
    msg: '',
    currentAuthority: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const keyres = yield call(getSerialNumberKey);
      if (keyres.code === 200) {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(keyres.data.key);
        const { logincode, password, Authorization } = payload;
        const value = {
          logincode: Base64.encode(logincode),
          password: encrypt.encrypt(password),
          Authorization,
          serial: keyres.data.serial,
        }
        const response = yield call(fakeAccountLogin, value);
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
          yield put(routerRedux.replace('/'));
        }
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: keyres,
        });
        // notification.open({
        //   message: '登录失败',
        //   description: keyres.msg,
        //   icon: <Icon type="exclamation-circle" style={{ color: '#F00' }} />,
        // });
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

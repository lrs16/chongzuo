import request from '@/utils/request';
// import { parse } from 'url';

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 请求序列号 /auth/getSerialNumberKey
export async function getSerialNumberKey() {
  return request('/auth/getSerialNumberKey');
}

// 登录请求
export async function fakeAccountLogin(params) {
  return request('/auth/doLogin', {
    method: 'POST',
    data: params,
    // body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      requestType: 'form',
    },
    requestType: 'form', // post request data type
  });
}
// 退出登录请求
export async function fakeLogout(access_token) {
  return request('/auth/logout', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

// ITSM登录请求
export async function ITSMLogin(params) {
  return request('/oauth/jwt/token/itsm', {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      requestType: 'form',
    },
    requestType: 'form',
  });
}

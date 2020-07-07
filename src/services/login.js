import request from '@/utils/request';
// import { parse } from 'url';

// export async function fakeAccountLogin(params) {
//   return request('/server/oauth/token', {
//     method: 'POST',
//     headers: {
//       'Authorization' : 'Basic YWNtZToxMjM0NTY=',
//       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
//     },
//     // data: params,
//     // data: {'grant_type': 'password', 'username': 'admin', 'password': 'password'},
//     data: 'grant_type=password&username=admin&password=password',
//     // data: 'grant_type=refresh_token&refresh_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInNlcnZlciJdLCJhdGkiOiIzN2YyNzBhZC1iYTQzLTQ0ZjUtOTJkOC0wZTFhMTA5N2UxZTgiLCJleHAiOjE1Nzk2NTcyNDEsImF1dGhvcml0aWVzIjpbIkFETUlOIl0sImp0aSI6IjI2ZWFlYmIyLTE3MWQtNDU2Ni05MDYyLTQ2Y2FlMDIwN2VkNSIsImNsaWVudF9pZCI6ImFjbWUifQ.CfQoS37cGTZucBXQPmEyMlMpmNRsUVSGOfTjG7jjrF3V-mAPjUl9KUSVU48hWPnMc7qMpsLaqRsalI4s8jK5iEP6R97pCNL69da0pSTXy73Kj5pGzCQ5oHXwdgB18sG14QF75Wlwzt_kDoGfsobGyoacdKc4VyRtbvyKz3kQmvsyAKUT788oEdBtiEL8ty8gwkudpLBwSEquBmvTVSbsJb_WEm0DjE9P6eK3FUZOB5KoTFRlYvJ_4YTCW5A5imal6sGOFuPXAS2atknlXcblrcTfGVrSuC0SXwmMBFmyhvyjeGEyp-AY_cAb_N4axapUMiCBgDuz28VJO6NVVrUkaA',
//   });
// }
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 登录请求
export async function fakeAccountLogin(params) {
  // return request('/api/login/account', {
  return request('/api-auth/oauth/user/token', {
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic d2ViQXBwOndlYkFwcA==',
    },
    requestType: 'form', // post request data type
  });
}
// 退出登录请求
export async function fakeLogout(access_token) {
  return request(`/api-auth/oauth/remove/token?access_token=${access_token}&redirect_uri=/`);
}

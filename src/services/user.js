import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request('/api/currentUser');
// }
// 根据token获取用户信息
export async function queryCurrent() {
  return request('/api-upms/upms_user/getCurrUserInfo');
}
// 根据token获取用户权限菜单
export async function queryMenus() {
  return request('/api-upms/upms_user/getCurrUserMenus');
}

export async function queryNotices() {
  return request('/api/notices');
}

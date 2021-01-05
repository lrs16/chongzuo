import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

// export async function queryCurrent() {
//   return request('/api/currentUser');
// }

// 获取系统菜单
export async function queryAllMenus() {
  return request('/upms/menu/list');
}

// 根据token获取用户信息
export async function queryCurrent() {
  return request('/upms/user/getCurrUserInfo');
}
// 根据token获取用户权限菜单
export async function queryMenus() {
  return request('/upms/user/getCurrUserMenus');
}

// 用户自己修改密码
export async function UserChangPW(params) {
  return request('/upms/user/password', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// ITSM获取当前处理人信息
export async function ITSMUser() {
  return request(`/itsm/common/function/getUserInfo`, {
    method: 'GET',
  });
}

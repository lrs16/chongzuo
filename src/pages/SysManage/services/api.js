/* eslint-disable import/prefer-default-export */
import { stringify } from 'qs';
import request from '@/utils/request';

// 请求用户列表
// export async function queryUsers() {
//   return request(`/api-upms/upms_user/list`);
// }

// 添加&编辑用户
export async function UpdateUsers(params) {
  return request('/api-upms/upms_user/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除用户
export async function removeUsers(userId) {
  return request(`/api-upms/upms_user/${userId}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}

// 查询用户
export async function SearchUsers(params) {
  return request(`/api-upms/upms_user/listPage`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
// 重置密码
export async function resetUsers(userId) {
  return request(`/api-upms/upms_user/${userId}/password`, {
    method: 'PUT',
  });
}
export async function queryDatas() {
  return request(`/api/getsysdatas`);
}

// 请求权限
export async function queryAuthorityList() {
  return request(`/api/authority`);
}

// 请求菜单列表
export async function queryMenuList() {
  return request(`/api-upms/upms_menu/list`);
}

// 添加菜单
export async function UpdateMenu(params) {
  return request('/api-upms/upms_menu/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 删除菜单
export async function removeMenu(id) {
  return request(`/api-upms/upms_menu/${id}`, {
    method: 'DELETE',
    data: id,
    requestType: 'form',
  });
}

// 查询菜单
export async function searchMenu(params) {
  return request('/api-upms/upms_menu/listPage', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 请求组织列表
export async function queryDeptList() {
  return request(`/api-upms/upms_dept/list`);
}

// 添加组织
export async function UpdateDept(params) {
  return request('/api-upms/upms_dept/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 删除组织
export async function removeDept(id) {
  return request(`/api-upms/upms_dept/${id}`, {
    method: 'DELETE',
    data: id,
    requestType: 'form',
  });
}
// 查询组织
export async function searchDept(params) {
  console.log(params);
  return request('/api-upms/upms_dept/listPage', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 请求权限列表
export async function queryRoleList() {
  return request(`/api-upms/upms_role/list`);
}

// 添加权限
export async function UpdateRole(params) {
  return request('/api-upms/upms_role/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 删除权限
export async function removeRole(id) {
  return request(`/api-upms/upms_role/${id}`, {
    method: 'DELETE',
    data: id,
    requestType: 'form',
  });
}

// 获取权限菜单
export async function queryRolemenu(roleId) {
  return request(`/api-upms/upms_role/getMenusByRoleId/${roleId}`);
}

// 分配权限菜单
export async function updateRolemenu(roleId, menuvalue) {
  return request(`/api-upms/upms_role/${roleId}/MenuIds`, {
    method: 'POST',
    body: JSON.stringify(menuvalue),
  });
}

// 设置用户权限
export async function updateUserRole(userId, rolevalue) {
  return request(`/api-upms/upms_user/${userId}/roleIds`, {
    method: 'POST',
    body: JSON.stringify(rolevalue),
  });
}

// 获取用户权限
export async function queryUserRole(userId) {
  return request(`/api-upms/upms_user/getRolesByUserId/${userId}`);
}

// 获取用户菜单
export async function queryUserMenu(userId) {
  return request(`/api-upms/upms_user/getMenusByUserId/${userId}`);
}

// 查询 ,
export async function searchRole(params) {
  return request('/api-upms/upms_role/listPage', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

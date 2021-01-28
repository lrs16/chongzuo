/* eslint-disable import/prefer-default-export */
import { stringify } from 'qs';
import request from '@/utils/request';

// 请求用户列表
// export async function queryUsers() {
//   return request(`  /upms/user/list`);
// }

// 添加&编辑用户
export async function UpdateUsers(params) {
  return request('/upms/user/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除用户
export async function removeUsers(id) {
  return request(`/upms/user/${id}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}

// 查询用户
export async function SearchUsers(params) {
  return request(`/upms/user/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 重置密码
export async function resetUsers(userId) {
  return request(`/upms/user/${userId}/password`, {
    method: 'PUT',
  });
}

// 请求菜单列表
export async function queryMenuList() {
  return request(`/upms/menu/list`);
}

// 添加菜单
export async function UpdateMenu(params) {
  return request('/upms/menu/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 删除菜单
export async function removeMenu(id) {
  return request(`/upms/menu/${id}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}

// 查询菜单
export async function searchMenu(params) {
  return request('/upms/menu/listPage', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 请求组织列表
export async function queryDeptList() {
  return request(`/upms/dept/list`);
}

// 添加组织
export async function UpdateDept(params) {
  return request('/upms/dept/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 编辑组织
export async function EditeDept(params) {
  return request('/upms/dept/', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 删除组织
export async function removeDept(id) {
  return request(`/upms/dept/${id}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}
// 查询组织
export async function searchDept(params) {
  return request('/upms/dept/listPage', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 按需加载组织机构树
export async function NeedDeptTree(params) {
  return request('/upms/dept/need', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 请求权限列表
export async function queryRoleList() {
  return request(`/upms/role/list`);
}

// 添加权限
export async function UpdateRole(params) {
  return request('/upms/role/saveOrUpdate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 删除权限
export async function removeRole(id) {
  return request(`/upms/role/${id}`, {
    method: 'DELETE',
    data: id,
    requestType: 'form',
  });
}

// 获取权限菜单
export async function queryRolemenu(roleId) {
  return request(`/upms/role/getMenusByRoleId/${roleId}`);
}

// 分配权限菜单
export async function updateRolemenu(roleId, menuvalue) {
  return request(`/upms/role/${roleId}/MenuIds`, {
    method: 'POST',
    body: JSON.stringify(menuvalue),
  });
}

// 设置用户权限
export async function updateUserRole(userId, rolevalue) {
  return request(` /upms/user/${userId}/roleIds`, {
    method: 'POST',
    body: JSON.stringify(rolevalue),
  });
}

// 获取用户权限
export async function queryUserRole(userId) {
  return request(` /upms/user/getRolesByUserId/${userId}`);
}

// 获取用户菜单
export async function queryUserMenu(userId) {
  return request(` /upms/user/getMenusByUserId/${userId}`);
}

// 查询 ,
export async function searchRole(params) {
  return request('/upms/role/listPage', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 数据字典list列表数据
export async function querySearchDropdownValue(page, limit, bodyParams) {
  return request(`/sys/dict/listPage/${page}/${limit}`, {
    method: 'POST',
    body: JSON.stringify(bodyParams),
  });
}

// 数据字典list列表数据 查询功能
export async function querySearchDropdownValue1(params) {
  return request(`/sys/dict/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function removeDict(id) {
  // 删除字典
  return request(`/sys/dict/${id}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}

export async function addDict(params) {
  // 新增字典
  return request('/sys/dict/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function editeDict(params) {
  // 更新字典
  return request('/sys/dict/', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

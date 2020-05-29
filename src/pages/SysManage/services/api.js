/* eslint-disable import/prefer-default-export */
import { stringify } from 'qs';
import request from '@/utils/request';

// 请求用户列表
export async function queryUsers() {
  return request(`/api-upms//upms_user/list`);
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

// 删除
export async function removeMenu(id) {
  const menuid = stringify(id);
  return request(`/api-upms/upms_menu/${menuid.replace(/id=/, '')}`, {
    method: 'DELETE',
    data: id,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestType: 'form',
  });
}

// 查询
export async function searchMenu(params) {
  return request('/api-upms/upms_menu/listPage', {
    method: 'POST',
    body: JSON.stringify(params),
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
  const menuid = stringify(id);
  return request(`/api-upms/upms_dept/${menuid.replace(/id=/, '')}`, {
    method: 'DELETE',
    data: id,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestType: 'form',
  });
}
// 查询组织
export async function searchDept(params) {
  return request('/api-upms/upms_dept/listPage', {
    method: 'POST',
    body: JSON.stringify(params),
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
  const roleid = stringify(id);
  return request(`/api-upms/upms_role/${roleid.replace(/id=/, '')}`, {
    method: 'DELETE',
    data: id,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestType: 'form',
  });
}

// 获取权限菜单
export async function queryRolemenu(roleId) {
  return request(`/api-upms//upms_role/getMenusByRoleId/${roleId}`);
}

// 分配权限菜单
export async function disposeRolemenu(roleId) {
  return request(`/api-upms/upms_role/${roleId}/MenuIds`, {
    method: 'POST',
  });
}

// 查询
export async function searchRole(params) {
  return request('/api-upms/upms_role/listPage', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

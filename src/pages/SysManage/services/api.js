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
export async function queryMenuList(params) {
  return request(`/upms/menu/tree`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 请求所有菜单
export async function queryAllMenuList() {
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

// 查询常用语
export async function queryExpressions(params) {
  return request(`/common/expressions/query`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 获取常用语
export async function getAndField(params) {
  return request(`/common/expressions/getExpressionsByContentAndField`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 保存常用语
export async function saveExpressions(params) {
  return request('/common/expressions/save', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 修改常用语
export async function updateExpressions(params) {
  return request('/common/expressions/update', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除常用语
export async function deleteExpressions(ids) {
  return request(`/common/expressions/delete?ids=${ids}`, {
    method: 'POST',
    requestType: 'form',
  });
}

// 修改常用语状态
export async function updateStatusExpressions(params) {
  return request('/common/expressions/updateStatus', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 查询报障用户
export async function queryDisableduser(params) {
  return request(`/common/disableduser/query`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 保存报障用户
export async function saveDisableduser(params) {
  return request(`/common/disableduser/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 编辑报障用户
export async function updateDisableduser(params) {
  return request(`/common/disableduser/update`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除报障用户
export async function deleteDisableduser(params) {
  return request(`/common/disableduser/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 新建超时规则
export async function saveTimerule(params) {
  return request(`/common/timerule/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 修改超时规则
export async function updateTimerule(params) {
  return request(`/common/timerule/update`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除超时规则
export async function deleteTimerule(params) {
  return request(`/common/timerule/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 查询超时规则
export async function queryTimerule(pageIndex, pageSize) {
  return request(`/common/timerule/query?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

// 新建工作日程
export async function saveTimetable(params) {
  return request(`/common/timetable/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 修改工作日程
export async function updateTimetable(params) {
  return request(`/common/timetable/update`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除工作日程
export async function deleteTimetable(params) {
  return request(`/common/timetable/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 查询工作日程
export async function queryTimetable(pageIndex, pageSize) {
  return request(`/common/timetable/query?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

// 上班工作时间/common/timetable/queryWorkTime
export async function queryWorkTime() {
  return request(`/common/timetable/queryWorkTime`);
}

// 修改上班时间 /common/timetable/updateWorkTime
export async function updateWorkTime(params) {
  return request(`/common/timetable/updateWorkTime`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 定时任务接口 mxj
// 定时任务列表
export async function qrtzjobList(pageNum, pageSize, bodyParams) {
  return request(`/job/qrtzjob/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    body: JSON.stringify(bodyParams),
  });
}

// 新增定时任务调度
export async function addqrtzJob(params) {
  return request(`/job/qrtzjob`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 编辑定时任务调度
export async function updateqrtzJob(params) {
  return request(`/job/qrtzjob`, {
    method: 'PUT',
    data: JSON.stringify(params),
  });
}

// 删除定时任务调度
export async function qrtzjobDelete(jobId) {
  return request(`/job/qrtzjob/${jobId}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}

// 任务调度状态修改
export async function changeStatus(params) {
  return request(`/job/qrtzjob/changeStatus`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// /job/qrtzjob/run/{jobId}  任务调度执行一次
export async function qrtzjobRun(jobId) {
  return request(`/job/qrtzjob/run/${jobId}`);
}

// 删除调度日志
export async function qrtzjoblogDelete(jobLogId) {
  return request(`/job/qrtzjoblog/${jobLogId}`, {
    method: 'DELETE',
    requestType: 'form',
  });
}

// /job/qrtzjoblog/clean 清除调度日志
export async function qrtzjoblogClean(params) {
  return request(`/job/qrtzjoblog/clean`, {
    method: 'DELETE',
    data: JSON.stringify(params),
  });
}

// /job/qrtzjoblog/listPage/{pageNum}/{pageSize} 分页查询日志信息
export async function qrtzjoblogList(params, pageNum, pageSize) {
  return request(`/job/qrtzjoblog/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    body: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 测试环境 /release/env/configList
export async function releaseConfigList(params) {
  return request(`/release/env/configList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 测试环境/release/env/saveConfig
export async function releasesaveConfig(params) {
  return request(`/release/env/saveConfig`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 测试环境/release/env/delConfig
export async function releasedelConfig(params) {
  return request(`/release/env/delConfig`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
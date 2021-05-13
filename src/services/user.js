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
// 获取通知数
export async function queryNoticeCount() {
  return request('/activiti/todoitem/listNum/0');
}

// 获取待办列表
export async function queryAllEvent(params) {
  return request(`/activiti/todoitem/listPage/${params.pageNum}/${params.pageSize}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 获取待办超时数
export async function queryOverTimeNum() {
  return request('/activiti/todoitem/getOverTimeNum');
}

// 获取通知信息
export async function queryNotices() {
  return request('/api/notices');
}

// ITSM获取当前处理人信息
export async function ITSMUser() {
  return request(`/common/function/getUserInfo`, {
    method: 'GET',
  });
}

// ITSM事件获取下一环节处理人列表
export async function EventFlowUserList(taskId, type) {
  return request(`/event/flow/getNextFlowUserList?taskId=${taskId}&type=${type}`, {
    method: 'GET',
  });
}
// ITSM需求获取下一环节处理人列表
export async function DemandFlowUserList(taskId, result) {
  return request(`/demand/process/listCandidateUser?taskId=${taskId}&result=${result}`, {
    method: 'GET',
  });
}
// ITSM故障获取下一环节处理人列表
export async function TroubleFlowUserList(taskId, result) {
  return request(`/trouble/flow/assignee?taskId=${taskId}&result=${result}`, {
    method: 'GET',
  });
}

// 加载问题下一环节处理人列表
export async function ProblemFlowUserList(taskId, result) {
  return request(`/problem/flow/assignee?taskId=${taskId}&result=${result}`, {
    method: 'GET',
  });
}

// 加载作业计划送审人列表
export async function taskFlowUserList() {
  return request(`/operation/flow/getCheckUserList`, {
    method: 'GET',
  });
}

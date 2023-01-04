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
  return request('/auth/getCurrUserInfo');
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

// 加载发布下一环节处理人列表
export async function releaseUserList(taskId, type) {
  return request(`/release/flow/getNextFlowUserList?taskId=${taskId}&type=${type}`, {
    method: 'GET',
  });
}

// 加载发布业务验证分派人列表   20220124改取发布清单验证这个角色
export async function dispatchBizUsers() {
  return request(`/release/from/getUserList?roleCodes=release.validate.list`, {
    method: 'GET',
  });
}

// 加载发布平台验证人
export async function dispatchPlatsers() {
  return request(`/release/from/getUserList?roleCodes=release.platformValid`, {
    method: 'GET',
  });
}

// 加载知识管理审核人员列表 
export async function knowledgeCheckUserList() {
  return request(`/knowledge/flow/getCheckUserList`, {
    method: 'GET',
  });
}

//  加载绩效人员列表 
export async function achievementsNextTaskUser(taskId) {
  return request(`/quality/assess/nextTaskUser?taskId=${taskId}`, {
    method: 'GET',
  });
}

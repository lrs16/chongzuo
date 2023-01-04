import request from '@/utils/request';

// 事件列表
export async function EventAssingned(params) {
  return request(`/event/form/findTaskByStatusAndAssigned`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
// 事件节点tab
export async function EventTabs(params) {
  return request(`/event/form/findTaskByStatusAndAssignedCount`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 故障节点tab
export async function TroubleTabs(params) {
  return request(`/trouble/flow/getHomeWaitDoTab`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 问题节点tab
export async function ProblemTabs(params) {
  return request(`/problem/flow/getHomeWaitDoTab`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 需求节点tab /demand/todo/personalTaskCount
export async function DemandTabs(userId) {
  return request(`/demand/todo/personalTaskCount?userId=${userId}`, {
    method: 'GET',
  });
}

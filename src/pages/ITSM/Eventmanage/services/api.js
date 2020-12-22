import request from '@/utils/request';

// 启动事件流程/itsm/event/flow/start
export async function EventFlowStart() {
  return request(`/itsm/event/flow/start`, {
    method: 'GET',
  });
}

// 事件登记/itsm/event/flow/saveFlow
export async function EventSaveFlow(params) {
  return request(`/itsm/event/flow/saveFlow`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件待办列表
export async function EventgetAllTask() {
  return request(`/itsm/event/form/findTaskByCandidateOrAssigned?pageIndex=0&pageSize=20`, {
    method: 'GET',
  });
}

// 根据流程待办id进入流程编辑页
export async function EventopenFlow(taskId) {
  return request(`/itsm/event/flow/openFlow?taskId=${taskId}`, {
    method: 'GET',
  });
}

// 事件待办
export async function queryEventodoList(params) {
  return request(`/api/event/queryTodoList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 事件查询
export async function queryList(params) {
  return request(`/api/event/queryList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

import request from '@/utils/request';

// 启动获取用户信息
export async function EventUser() {
  return request(`/common/function/getUserInfo`, {
    method: 'GET',
  });
}

// 启动事件流程/event/flow/start
export async function EventFlowStart() {
  return request(`/event/flow/start`, {
    method: 'GET',
  });
}

// 事件登记保存/event/flow/saveFlow
export async function EventSave(params) {
  return request(`/event/flow/saveFlow`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件流转/event/flow/submit
export async function EventFlow(params) {
  return request(`/event/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除/event/flow/delete
export async function EventDelete(params) {
  return request(`/event/flow/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件待办列表
export async function EventgetAllTask(params) {
  return request(`/event/form/findTaskByCandidateOrAssigned`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 根据流程待办id进入流程编辑页
export async function EventopenFlow(taskId) {
  return request(`/event/flow/openFlow?taskId=${taskId}`, {
    method: 'GET',
    //  requestType: 'json',
  });
}

// 编辑页保存/event/flow/saveFlow
export async function EventSaveFlow(params) {
  return request(`/event/flow/saveFlow`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 回退信息保存/event/flow/saveFallbackMsg
export async function saveFallbackMsg(msg, taskId) {
  return request(`/event/flow/saveFallbackMsg`, {
    method: 'POST',
    data: { msg, taskId },
    requestType: 'form',
  });
}

// 编辑页事件历史记录
export async function EventRecords(processId) {
  return request(`/event/flow/getHistoricByProcessId?processId=${processId}`, {
    method: 'GET',
  });
}
// 编辑页流程图/event/flow/image
export async function EventImage(processInstanceId) {
  return request(`/event/flow/image?processInstanceId=${processInstanceId}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 事件待办
export async function queryEventodoList(params) {
  return request(`/api/event/queryTodoList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 事件查询 /event/form/getEventQueryList
export async function queryList(params) {
  return request(`/event/form/getEventQueryList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件查询，查看详情 /event/form/openView
export async function queryOpenView(mainId) {
  return request(`/event/form/openView?mainId=${mainId}`, {
    method: 'GET',
  });
}

// 下载itsm/event/form/downloadExcel
export async function querydownload(params) {
  return request(`/event/form/downloadQueryExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob',
  });
}

// 获取超时列表
export async function querytimeout(params) {
  return request(`/event/form/findTimeoutOrder`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 下载超时列表
export async function timeoutdownload(params) {
  return request(`/event/form/downloadTimeoutExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob',
  });
}

// 是否超时 
export async function judgeTimeoutStatus(params) {
  return request(`/event/flow/judgeTimeoutStatus`, {
    method: 'POST',
    data: { taskId: params },
    requestType: 'form',
  });
}

// 保存超时信息
export async function saveTimeoutMsg(params) {
  return request(`/event/flow/saveTimeoutMsg`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
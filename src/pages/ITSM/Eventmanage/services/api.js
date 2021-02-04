import request from '@/utils/request';

// 启动获取用户信息
export async function EventUser() {
  return request(`/itsm/common/function/getUserInfo`, {
    method: 'GET',
  });
}

// 启动事件流程/itsm/event/flow/start
export async function EventFlowStart() {
  return request(`/itsm/event/flow/start`, {
    method: 'GET',
  });
}

// 事件登记保存/itsm/event/flow/saveFlow
export async function EventSave(params) {
  return request(`/itsm/event/flow/saveFlow`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件流转/itsm/event/flow/submit
export async function EventFlow(params) {
  return request(`/itsm/event/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除/itsm/event/flow/delete
export async function EventDelete(params) {
  return request(`/itsm/event/flow/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件待办列表
export async function EventgetAllTask(params) {
  return request(`/itsm/event/form/findTaskByCandidateOrAssigned`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 根据流程待办id进入流程编辑页
export async function EventopenFlow(taskId) {
  return request(`/itsm/event/flow/openFlow?taskId=${taskId}`, {
    method: 'GET',
    //  requestType: 'json',
  });
}

// 编辑页保存/itsm/event/flow/saveFlow
export async function EventSaveFlow(params) {
  return request(`/itsm/event/flow/saveFlow`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 回退信息保存/itsm/event/flow/saveFallbackMsg
export async function saveFallbackMsg(msg, taskId) {
  return request(`/itsm/event/flow/saveFallbackMsg`, {
    method: 'POST',
    data: { msg, taskId },
    requestType: 'form',
  });
}

// 编辑页事件历史记录
export async function EventRecords(processId) {
  return request(`/itsm/event/flow/getHistoricByProcessId?processId=${processId}`, {
    method: 'GET',
  });
}
// 编辑页流程图/itsm/event/flow/image
export async function EventImage(processInstanceId) {
  return request(`/itsm/event/flow/image?processInstanceId=${processInstanceId}`, {
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

// 事件查询 /itsm/event/form/getEventQueryList
export async function queryList(params) {
  return request(`/itsm/event/form/getEventQueryList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 事件查询，查看详情 /itsm/event/form/openView
export async function queryOpenView(mainId) {
  return request(`/itsm/event/form/openView?mainId=${mainId}`, {
    method: 'GET',
  });
}

// 下载itsm/event/form/downloadExcel
export async function querydownload(params) {
  return request(`/itsm/event/form/downloadQueryExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

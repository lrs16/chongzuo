import request from '@/utils/request';

// 需求登记
export async function DemandStart(params) {
  return request(`/demand/register/startProcess`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 需求登记流转
export async function DemandStartAndNext(params) {
  return request(`/demand/register/startAndNext`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 需求待办列表
export async function DemandtoDoList(params) {
  return request(
    `/demand/todo/toDoList?limit=${params.limit}&page=${params.page}&userId=${params.userId}`,
    {
      method: 'GET',
    },
  );
}

// 编辑历史记录
export async function DemandRecords(processId) {
  return request(`/demand/todo/processLog/${processId}`, {
    method: 'GET',
  });
}

// 编辑流程图/demand/todo/processImage/{processId}
export async function DemandImage(processId) {
  return request(`/demand/todo/processImage/${processId}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 待办编辑
export async function DemandOpenFlow(processInstanceId, taskId) {
  return request(
    `/demand/todo/todoDetail?processInstanceId=${processInstanceId}&taskId=${taskId}`,
    {
      method: 'GET',
    },
  );
}

// 通用保存
export async function DemandSaveOrUpdate(params) {
  return request(`/demand/todo/processSaveOrUpdate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 回退
export async function DemandgoBack(params) {
  return request(`/demand/todo/goBack/${params.taskId}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 编辑登记保存/demand/todo/registerSaveOrUpdate
export async function registerSaveOrUpdate(params) {
  return request(`/demand/todo/registerSaveOrUpdate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 编辑流转 /demand/todo/nextStep
export async function NextStep(params) {
  return request(`/demand/todo/nextStep`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 需求跟踪保存/demand/track/addOrUpdate
export async function TrackUpdata(params) {
  return request(`/demand/track/addOrUpdate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 需求跟踪查询 /demand/track/list/{demandId}
export async function TrackList(demandId) {
  return request(`/demand/track/list/${demandId}`, {
    method: 'GET',
  });
}

// 需求跟踪删除TrackDelete
export async function TrackDelete(id) {
  return request(`/demand/track/delete/${id}`, {
    method: 'DELETE',
  });
}

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
  return request(`/demand/todo/completeRegister`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 需求待办列表
export async function DemandtoDoList(params) {
  const { limit, page, userId, demandId, taskName, creationStartTime, creationEndTime, creationTime } = params;
  const registerPerson = params.registerPerson !== undefined ? params.registerPerson : '';
  const demandType = params.demandType !== undefined ? params.demandType : '';
  const title = params.title !== undefined ? params.title : '';
  return request(
    `/demand/todo/toDoList?limit=${limit}&page=${page}&userId=${userId}&demandId=${demandId}&demandType=${demandType}&registerPerson=${registerPerson}&taskName=${taskName}&title=${title}&creationTime=${creationTime}&creationStartTime=${creationStartTime}&creationEndTime=${creationEndTime}`,
    {
      method: 'GET',
    },
  );
}

// 编辑历史记录
export async function DemandRecords(processId) {
  return request(`/demand/todo/taskHistory/${processId}`, {
    method: 'GET',
  });
}

// 流程日志(未用)
export async function DemandProcess(processId) {
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
// 删除/demand/process/delete
export async function DemandDlete(processId) {
  return request(`/demand/process/delete?processId=${processId}`, {
    method: 'DELETE',
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
export async function TracksList(demandId) {
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

// 需求查询列表
export async function DemandQuery(params) {
  return request(`/demand/query/demandQuery`, {
    method: 'POST',
    body: JSON.stringify(params)
  },
  );
}

// 需求查询详情/demand/query/detail
export async function QueryDetail(processInstanceId) {
  return request(`/demand/query/detail?processInstanceId=${processInstanceId}`, {
    method: 'GET',
  });
}

// 导出 /demand/query/export
export async function QueryExport(params) {
  return request(`/demand/query/export`, {
    method: 'POST',
    responseType: 'blob',
    body: JSON.stringify(params),
    // requestType:'form'
  });
}

// 登记环节结束流程
export async function RegisterClose(taskId, userId) {
  return request(`/demand/todo/registerClose?taskId=${taskId}&userId=${userId}`, {
    method: 'GET',
  });
}
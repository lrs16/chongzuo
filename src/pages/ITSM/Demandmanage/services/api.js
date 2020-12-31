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
  return request(`/demand/todo/toDoList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
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

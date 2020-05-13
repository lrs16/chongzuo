import request from '@/utils/request';

export async function queryRule(params) {
  return request('/basicMonitor/hostConfig/list', {
    method: 'POST',
    data: { ...params},
  });
}
export async function removeRule(params) {
  return request('/basicMonitor/hostConfig/delete', {
    method: 'POST',
    // data: { ...params, method: 'delete' },
    params,
  });
}
export async function addRule(params) {
  return request('/basicMonitor/hostConfig/addOrEdit', {
    method: 'POST',
    data: { ...params, method: 'get' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
export async function querySort() {
  return request('/basicMonitor/hostConfig/sortMenu', {
  });
}

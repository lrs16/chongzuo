import request from '@/utils/request';

// 获取列表信息
export async function queryTodoList() {
  return request(`/api/release/todolist`, {
    method: 'GET',
  });
}

// 新建单
export async function addkowledge() {
  return request(`/knowledge/flow/add`, {
    method: 'GET',
  });
}

// 保存
export async function savekowledge(params) {
  return request(`/knowledge/flow/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 提交
export async function submitkowledge(params) {
  return request(`/knowledge/flow/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布
export async function releasekowledge(params) {
  return request(`/knowledge/flow/release`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 打开待办
export async function openkowledge(params) {
  return request(`/knowledge/flow/openFlow`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 获取审核人员列表
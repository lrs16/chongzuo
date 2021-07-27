import request from '@/utils/request';

// 启动获取用户信息  /release/from/findTodoList
export async function queryTodoList(params) {
  return request(`/release/from/findTodoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 启动流程 /release/flow/start
export async function startFlow() {
  return request(`/release/flow/start`, {
    method: 'GET',
  });
}

// 获取下一节点处理人列表 /release/flow/getNextFlowUserList
export async function nextFlowUserList() {
  return request(`/release/flow/getNextFlowUserList`, {
    method: 'GET',
  });
}
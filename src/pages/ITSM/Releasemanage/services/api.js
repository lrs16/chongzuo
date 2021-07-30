import request from '@/utils/request';

// 启动待办信息  /release/from/findTodoList
export async function queryTodoList(params) {
  return request(`/release/from/findTodoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
// export async function queryTodoList() {
//   return request(`/api/release/todolist`, {
//     method: 'GET',
//   });
// }

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

// 登记工单保存
export async function saveRegister(params) {
  return request(`/release/flow/saveRegister`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 流程提交
export async function flowSubmit(params) {
  return request(`/release/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 打开待办
export async function openFlow(releaseNo) {
  return request(`/release/flow/openFlow?releaseNo=${releaseNo}`, {
    method: 'GET',
  });
}
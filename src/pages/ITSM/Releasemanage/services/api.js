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

// 出厂测试保存
export async function saveRegister(params) {
  return request(`/release/flow/saveRegister`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 平台验证保存
export async function saveplatformValid(params) {
  return request(`/release/flow/savePlatformValid`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 业务验证保存
export async function savereleaseBizValid(params) {
  return request(`/release/flow/saveBizValid`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布实施准备保存
export async function savePracticePre(params) {
  return request(`/release/flow/savePracticePre`, {
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

// 删除发布清单/release/from/releaseListDel
export async function releaseListDel(params) {
  return request(`/release/from/releaseListDel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 编辑发布清单，清单id为空时为添加/release/from/releaseListSingleEdit,业务验证待办、版本管理员审核用到
export async function releaseListEdit(params) {
  return request(`/release/from/releaseListSingleEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 分派清单
export async function releaseListAssign(params) {
  return request(`/release/from/dispatchBizTodo`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务验证待办列表
export async function bizTodoList(params) {
  return request(`/release/from/bizTodoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务复核待办列表
export async function bizCheckTodo(params) {
  return request(`/release/from/bizCheckTodo`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


// 打开业务验证 /release/from/openBizTodoList
export async function openBizTodoList(params) {
  return request(`/release/from/openBizTodoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务验证查看清单/release/from/openBizTodoView
export async function openBizTodoView(params) {
  return request(`/release/from/openBizTodoView`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务验证完成 /release/from/completeVerify
export async function completeVerify(params) {
  return request(`/release/from/completeVerify`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布实施准备导出/release/fileProc/expPracticePre?taskId=982521
export async function expPracticePre(taskId) {
  return request(`/release/fileProc/expPracticePre?taskId=${taskId}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 版本管理员合并工单/release/flow/mergeOrders
export async function mergeOrders(params) {
  return request(`/release/flow/mergeOrders`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 版体管理员拆分工单/release/flow/splitOrders
export async function splitOrders(params) {
  return request(`/release/flow/splitOrders`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 版本管理员附件清单更新/release/from/releaseAttachBatchEdit
export async function attachBatchEdit(params) {
  return request(`/release/from/releaseAttachBatchEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 版本管理员审核表单保存/release/flow/saveCheckVersion
export async function saveCheckVersion(params) {
  return request(`/release/flow/saveCheckVersion`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 科室负责人审核表单保存/release/flow/saveCheckVersion
export async function saveCheckDirector(params) {
  return request(`/release/flow/saveCheckDirector`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 中心领导审核表单保存/release/flow/saveCheckLeader
export async function saveCheckLeader(params) {
  return request(`/release/flow/saveCheckLeader`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布实施表单保存 /release/flow/savePracticeDone
export async function savePracticeDone(params) {
  return request(`/release/flow/savePracticeDone`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 业务复核 /release/flow/saveBizCheck
export async function saveBizCheck(params) {
  return request(`/release/flow/saveBizCheck`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 清单统计 /release/flow/classifyList
export async function classifyList(taskIds) {
  return request(`/release/from/classifyList?taskIds=${taskIds}`, {
    method: 'GET',
  });
}
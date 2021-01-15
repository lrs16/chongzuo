import request from '@/utils/request';

export async function queryfaultTodoList(params) { // 故障待办列表
  return request('/api/fault/faulttodolist', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryfaultSearchList(params) { // 故障查询列表
  return request('/api/fault/faultsearchlist', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 故障明细表
export async function queryFaultDetailList(params) {
  return request(`/api/fault/faultdetailList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// export async function queryfaultsearchdetailslist() { // 故障查询列表详情页
//   return request('/api/fault/faultsearchdetailslist', {
//     method: 'POST',
//   });
// }

export async function queryfaultsearchdetailslist(detailsid) { // 故障查询列表详情页
  return request(`/api/fault/faultsearchdetailslist?detailsid=${detailsid}`);
}


// ***故障登记页 --真实接口

// 获取新的故障编号
export async function queryTroubleGetNewno() {
  return request(`/itsm/trouble/flow/getNewNo`, {
    method: 'GET',
  });
}

// 获取登录用户信息
export async function queryCurrUserInfo() {
  return request('/upms/user/getCurrUserInfo');
}
// export async function queryCurrUserInfo() {
//   return request('/itsm/event/flow/getUserInfo');
// }

// 保存用户数据携带的id /itsm/trouble/flow/start 故障流程启动
export async function querySaveUserId() {
  return request(`/itsm/trouble/flow/start`);
}

// 故障登记保存
export async function querySavefaultRegister(params) {
  return request(`/itsm/trouble/flow/saveFlow`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// ***故障待办页

// 故障待办列表
export async function queryfaultTodoList1(current, pageSize) {
  const params = {};
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/itsm/trouble/flow/getWaitDoPage`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 故障待办列表 查询功能
export async function querySearchfaultTodoList1(current, pageSize, values) {
  const params = values;
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/itsm/trouble/flow/getWaitDoPage`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 故障待办列表  导出下载/itsm/trouble/flow/expExcelWaitDoList
export async function querydownload(current, pageSize, values) {
  const params = values;
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/itsm/trouble/flow/expExcelWaitDoList`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 故障查询列表  导出下载/itsm/trouble/flow/expExcelOrderList
export async function querydownload1(current, pageSize, values) {
  const params = values;
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/itsm/trouble/flow/expExcelOrderList`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// ***故障待办详情页 （*故障工单页）

// /itsm/trouble/flow/openFlow 根据流程待办id，进入待办流程编辑页 (故障待办详情页---共五个编辑页)
export async function queryfaultTodoDetailEdit(id) {
  return request(`/itsm/trouble/flow/openFlow?taskId=${id}`);
}

// 删除操作！/itsm/trouble/flow/deleteInstance 根据故障流程实例id，删除流程实例及业务数据数据 传ids
export async function deleteInstance(id) {
  return request(`/itsm/trouble/flow/deleteInstance?ids=${id}`, {
    method: 'DELETE',
  });
}

// 回退操作！
export async function queryRollBack(params) { // 回退操作
  return request(`/itsm/trouble/flow/submit`,{
    method:'POST',
    data: params,
    requestType: 'form',
  })
}

// 接单操作！
export async function queryTroubleHandleOrder(taskId){
  return request(`/itsm/trouble/flow/troubleHandleOrder?taskId=${taskId}`, {
    method: 'GET',
  })
}

//  转单操作！
// export async function transferOrder(taskId,userIds) {
//   return request(`/itsm/trouble/flow/transfer?taskId=${taskId}&userIds=${userIds}`,{
//     method:'POST'
//   })
// }

// 提交流程至下一节点前是否需要选择待办人  /itsm/trouble/flow/assignee 
// 参数1 result --流程分支走向标识：-1 退回|0 不通过|1 下一环节
// 参数2 taskId(必填) --流程待办id
export async function toSelectTodoperson(taskId) {
  return request(`/itsm/trouble/flow/assignee?taskId=${taskId}`)
}

// /itsm/trouble/flow/submit 根据待办id提交流程至下一节点 参数1 backReason--退回原因  参数2 result --流程分支走向标识：-1 退回|0 不通过|1 下一环节 
// 参数3 taskId(必填) --流程待办id
// 参数4 userIds 待办人id，多人则用’,’分隔
export async function submitProToNextNode(taskId, result) {
  return request(`/itsm/trouble/flow/submit?taskId=${taskId}&userIds=1&result=${result}`,{
    method:'POST',
  })
}

// 展示流程图 （*故障流程页）
export async function getFlowImage(id) {
  return request(`/itsm/trouble/flow/getFlowImage?id=${id}`, {
    method: 'GET',
    responseType: 'blob', // 必须注明返回二进制流
  })
}

// 流程日志
export async function getFlowLog(id) {
  return request(`/itsm/trouble/flow/getFlowLog?id=${id}`)
}


// ***故障查询页

// /itsm/trouble/flow/getOrderPage 获取故障工单列表 故障查询列表
export async function queryfaultSearchList1(current, pageSize) {
  const params = {};
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/itsm/trouble/flow/getOrderPage`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 故障查询页 查询功能
export async function queryTosearchfaultSearchList1(current, pageSize, values) {
  const params = values;
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/itsm/trouble/flow/getOrderPage`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// /itsm/trouble/flow/getOrderDetail 根据故障主体id获取故障工单详情 故障查询列表详情
export async function queryOrderDetail(id) {
  return request(`/itsm/trouble/flow/getOrderDetail?id=${id}`, {
    method: 'GET',
  })
}

// 获取流转，转单 系统所有的用户
export async function SearchUsers(params) {
  return request(`/upms/user/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
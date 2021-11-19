import request from '@/utils/request';

export async function queryfaultTodoList(params) {
  // 故障待办列表
  return request('/api/fault/faulttodolist', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryfaultSearchList(params) {
  // 故障查询列表
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

export async function queryfaultsearchdetailslist(detailsid) {
  // 故障查询列表详情页
  return request(`/api/fault/faultsearchdetailslist?detailsid=${detailsid}`);
}

// ***故障登记页 --真实接口

// 获取新的故障编号
export async function queryTroubleGetNewno() {
  return request(`/trouble/flow/getNewNo`, {
    method: 'GET',
  });
}

// 获取登录用户信息
export async function queryCurrUserInfo() {
  return request('/auth/getCurrUserInfo');
}

// ITSM获取当前处理人信息
export async function ITSMUser() {
  return request(`/common/function/getUserInfo`, {
    method: 'GET',
  });
}

// 保存用户数据携带的id /trouble/flow/start 故障流程启动
export async function querySaveUserId() {
  return request(`/trouble/flow/start`);
}

// 故障管理保存(整合了start、getNewNo、saveFlow三个方法为一个)
export async function startandsave(params) {
  return request(`/trouble/flow/saveTrouble`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 故障登记保存
export async function querySavefaultRegister(params) {
  return request(`/trouble/flow/saveFlow`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ***故障待办页

// 故障待办列表
export async function queryfaultTodoList1(current, pageSize) {
  const params = {};
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  return request(`/trouble/flow/getWaitDoPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 故障待办列表 查询功能
export async function querySearchfaultTodoList1(params) {
  return request(`/trouble/flow/getWaitDoPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// export async function querySearchfaultTodoList1(params) {
//   return request(`/trouble/flow/getWaitDoPage`, {
//     method: 'POST',
//     body: JSON.stringify(params)
//   })
// }

// 故障待办列表  导出下载/trouble/flow/expExcelWaitDoList
export async function querydownload(values) {
  return request(`/trouble/flow/expExcelWaitDoList`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    body: JSON.stringify(values),
    responseType: 'blob',
  });
}

// 故障查询列表  导出下载/trouble/flow/expExcelOrderList
export async function querydownload1(params) {
  return request(`/trouble/flow/expExcelOrderList`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      pageNum: params.current,
      pageSize: params.pageSize
    }),
    responseType: 'blob'
  });
}

// ***故障待办详情页 （*故障工单页）

// /trouble/flow/openFlow 根据流程待办id，进入待办流程编辑页 (故障待办详情页---共五个编辑页)
export async function queryfaultTodoDetailEdit(id) {
  return request(`/trouble/flow/openFlow?taskId=${id}`);
}

// 删除操作！/trouble/flow/deleteInstance 根据故障流程实例id，删除流程实例及业务数据数据 传ids
export async function deleteInstance(id) {
  return request(`/trouble/flow/deleteInstance?ids=${id}`, {
    method: 'DELETE',
  });
}

// 回退操作！
export async function queryRollBack(params) {
  // 回退操作
  return request(`/trouble/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 接单操作！
export async function queryTroubleHandleOrder(taskId) {
  return request(`/trouble/flow/troubleHandleOrder?taskId=${taskId}`, {
    method: 'GET',
  });
}

//  转单操作！
// export async function transferOrder(taskId,userIds) {
//   return request(`/trouble/flow/transfer?taskId=${taskId}&userIds=${userIds}`,{
//     method:'POST'
//   })
// }

// 提交流程至下一节点前是否需要选择待办人  /trouble/flow/assignee
// 参数1 result --流程分支走向标识：-1 退回|0 不通过|1 下一环节
// 参数2 taskId(必填) --流程待办id
export async function toSelectTodoperson(taskId) {
  return request(`/trouble/flow/assignee?taskId=${taskId}`);
}

// /trouble/flow/submit 根据待办id提交流程至下一节点 参数1 backReason--退回原因  参数2 result --流程分支走向标识：-1 退回|0 不通过|1 下一环节
// 参数3 taskId(必填) --流程待办id
// 参数4 userIds 待办人id，多人则用’,’分隔
export async function submitProToNextNode(taskId, result, userIds) {
  return request(`/trouble/flow/submit?taskId=${taskId}&userIds=${userIds}&result=${result}`, {
    method: 'POST',
  });
}

// 展示流程图 （*故障流程页）
export async function getFlowImage(id) {
  return request(`/trouble/flow/getFlowImage?id=${id}`, {
    method: 'GET',
    responseType: 'blob', // 必须注明返回二进制流
  });
}

// 流程日志
export async function getFlowLog(id) {
  return request(`/trouble/flow/getFlowLog?id=${id}`);
}

// ***故障查询页

// /trouble/flow/getOrderPage 获取故障工单列表 故障查询列表
export async function queryfaultSearchList1(params) {
  return request(`/trouble/flow/getOrderPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 故障查询页 查询功能
export async function queryTosearchfaultSearchList1(params) {
  return request(`/trouble/flow/getOrderPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// /trouble/flow/getOrderDetail 根据故障主体id获取故障工单详情 故障查询列表详情
export async function queryOrderDetail(id) {
  return request(`/trouble/flow/getOrderDetail?id=${id}`, {
    method: 'GET',
  });
}

// 获取流转，转单 系统所有的用户
export async function SearchUsers(params) {
  return request(`/upms/user/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 数据字典结构树 /sys/dict/keyVal
export async function querkeyVal(dictModule, dictType) {
  return request(`/sys/dict/keyVal`, {
    method: 'POST',
    data: { dictModule, dictType },
    requestType: 'form',
  });
}

export async function queryFaultdictVal(id) {
  return request(`/sys/dict/queryChildDictLower`, {
    method: 'POST',
    data: { id },
  });
}


// ***故障统计

// /trouble/flow/statOrderRelateDict  数据字典相关字段统计故障工单
export async function queryfaultWorkoderCount(pageNum, pageSize, dictType) {
  return request(`/trouble/flow/statOrderRelateDict`, {
    method: 'POST',
    data: { pageNum, pageSize, dictType },
    body: JSON.stringify(dictType),
  });
}

export async function queryfaultWorkoderCount1(current, pageSize, dictType, values) {
  const params = values;
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  params.dictType = dictType;
  return request(`/trouble/flow/statOrderRelateDict`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function querycountdownload(current, pageSize, values, dictType) {
  const params = values;
  params.pageNum = current; // 当前页
  params.pageSize = pageSize; // 页码
  params.dictType = dictType;
  return request(`/trouble/flow/expStatOrderRelateDict`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 故障工单附件打包下载
export async function downFileToZip(id) {
  return request(`/trouble/flow/downFileToZip?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 作业计划测试
export async function test(params) {
  return request(`/operation/form/downloadMyOperationExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

//  生成故障分析报告
export async function addTroubleReport(mainId) {
  return request(`/trouble/flow/addTroubleReport?mainId=${mainId}`)
}

//  保存故障分析报告
export async function saveTroubleReport(params) {
  return request(`/trouble/flow/saveTroubleReport`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}
//  提交故障分析报告
export async function submitTroubleReport(params) {
  return request(`/trouble/flow/submitTroubleReport`,{
    method:'POST',
    data:{mainId:params},
    requestType:'form'
  })
}

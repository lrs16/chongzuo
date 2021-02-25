import request from '@/utils/request';

//  问题登记
//  问题登记信息
// 登录用户信息
export async function queryCurrent() {
  return request('/upms/user/getCurrUserInfo');
}

//  获取新的问题编号
export async function getNewno() {
  return request(`/problem/flow/getNewNo`);
}

export async function problemList() {
  return request(`/api/problemList`);
}

//  保存用户数据携带的id
export async function getAddid() {
  return request(`/problem/flow/start`);
}

//  登记保存
export async function saveRegister(params) {
  return request(`/problem/flow/saveFlow`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  待办
export async function besolveList(current, pageSize) {
  const obj = {};
  obj.pageNum = current;
  obj.pageSize = pageSize;
  return request(`/problem/flow/getWaitDoPage`, {
    method: 'POST',
    body: JSON.stringify(obj),
  });
}
//  待办查询
export async function searchBesolve(current, pageSize, values) {
  const obj = values;
  obj.pageNum = current;
  obj.pageSize = pageSize;
  return request(`/problem/flow/getWaitDoPage`, {
    method: 'POST',
    body: JSON.stringify(obj),
  });
}

export async function deleteTobo(deleteid) {
  return request(`/problem/flow/deleteInstance?ids=${deleteid}`, {
    method: 'DELETE',
  });
}

//  退回原因
export async function backReason(id, values) {
  const obj = values;
  obj.userIds = id;
  obj.taskId = id;
  obj.result = -1;
  return request(`/problem/flow/submit`, {
    method: 'POST',
    data: obj,
    requestType: 'form',
  });
}

//  登记详情页
export async function todoInformation(id) {
  return request(`/problem/flow/openFlow?taskId=${id}`);
}

//  流转的待办人的接口
export async function tobeListpeople(taskId) {
  return request(`/problem/flow/assignee?taskId=${taskId}&result=1`);
}

//  流转待办人保存接口
export async function saveTobelist(params) {
  // const obj = {};
  // obj.taskId = taskId;
  // obj.userIds = 1;
  return request(`/problem/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

//  后端返回的流程
export async function getFlowImage(id) {
  return request(`/problem/flow/getFlowImage?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

//  流程日志
export async function getFlowlog(id) {
  return request(`/problem/flow/getFlowLog?id=${id}`);
}

// 事件列表
export async function eventList() {
  return request(`/api/mockEvent`, {
    method: 'POST',
  });
}

// 发布列表
export async function realselist() {
  return request(`/api/mockRealse`, {
    method: 'POST',
  });
}

// // 问题查询列表查询
export async function queryList(params) {
  return request(`/problem/flow/getOrderPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// // 处理率查询列表查询
export async function handlequeryList(params) {
  console.log('params: ', params);
  switch(params.handleStatus) {
    case '0':
    case '1':
      return request(`/problem/stat/getOrderByHandledList`,{
        method:'POST',
        body:JSON.stringify(params)
      })
    default:
      return request(`/problem/stat/getOrderByTimeList`,{
        method:'POST',
        body:JSON.stringify(params)
      })
  }
}


//  接口上传
export async function fileUpload() {
  return request(`/sys/file/upload`, {
    method: 'POST',
  });
}

export async function problemHandleOrder(id) {
  return request(`/problem/flow/problemHandleOrder?taskId=${id}`);
}

//  查询详情
export async function queryDetail(id) {
  return request(`/problem/flow/getOrderDetail?id=${id}`);
}

//  转单
export async function transferOrder() {
  return request(`/problem/flow/transfer`, {
    method: 'POST',
  });
}

// 下载itsm/event/form/downloadExcel
export async function querydownload(params) {
  return request(`/problem/flow/expExcelOrderList`, {
    method: 'POST',
    // responseType: 'blob',
    body: JSON.stringify(params),
  });
}

// 下载文件
export async function downFile(id) {
  return request(`/sys/file/${id}`);
}

// 数据字典结构树 /sys/dict/keyVal
export async function querkeyVal(dictModule, dictType) {
  return request(`/sys/dict/keyVal`, {
    method: 'POST',
    data: { dictModule, dictType },
    requestType: 'form',
  });
}

//  处理率的列表
export async function handleGratelist(handleStatus) {
  return request(`/problem/stat/getOrderByHandledList`,{
    method:'POST',
    body:JSON.stringify(handleStatus)
  })
}

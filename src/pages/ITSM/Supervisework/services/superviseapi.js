import request from '@/utils/request';

// *****工作督办流程管理

export async function startFlow() { // 新建单
  return request(`/work/flow/add`);
}

export async function toCheck(params) { // 审核
  return request(`/work/flow/check`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}

export async function batchCheck(params) { // 批量审核
  return request(`/work/flow/batchCheck`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function delaySave(params) { // 延期保存
  return request(`/work/flow/delaySave`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function delayToCheck(params) { // 延期送审
  return request(`/work/flow/delayToCheck`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function taskDelete(submitParams) { // 删除工单
  return request(`/work/flow/delete`, {
    method: 'POST',
    data: submitParams,
    requestType: 'form'
  })
}

export async function fallback(params) {  // 回退
  return request(`/work/flow/fallback`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function getWorkUserList() { // 获取工作人员列表
  return request(`/work/flow/getWorkUserList`, {
    method: 'GET',
  });
}

export async function openFlow(mainId) {  // 打开待办
  return request(`/work/flow/openFlow?mainId=${mainId}`)
}

export async function responseAccpt(params) { // 响应接单 
  return request(`/work/flow/response`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}

export async function saveForm(params) { // 保存 ---保存所有表单
  return request(`/work/flow/save`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function saveSupervise(params) { // 保存督办
  return request(`/work/flow/saveSupervise`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function submitForm(params) { // 提交 ---填报表单提交到工作负责人
  return request(`/work/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

// *****工作督办表单查询管理

export async function getMyWorkList(params) { // 获取工作列表
  return request(`/work/form/getMyWork`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function getWorkQueryList(params) { // 获取工作督办查询列表
  return request(`/work/form/getWorkQueryList`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

export async function downloadMyWorkExcel(params) { // 下载-工作列表
  return request(`/work/form/downloadWorkExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob'
  })
}

export async function downloadWorkQueryExcel(params) { // 下载-工作督办查询列表
  return request(`/work/form/downloadWorkQueryExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob'
  })
}

export async function openView(params) { // 查询表单内容（查询页详情）
  return request(`/work/form/openView?mainId=${params}`)
}

export async function getSuperviseList(params) { // 获取督办列表
  return request(`/work/form/getSuperviseList?mainId=${params}`)
}


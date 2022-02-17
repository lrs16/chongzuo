import request from '@/utils/request';

// 临时发布 出厂测试登记
export async function saveRegister(params) {
  return request(`/release/temp/saveRegister`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 临时发布 列表
export async function orderList(params) {
  return request(`/release/temp/orderList`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 临时发布 打开临时发布工单
export async function openOrder(releaseNo) {
  return request(`/release/temp/openOrder?releaseNo=${releaseNo}`, {
    method: 'GET',
  });
}

// 获取下一环节的处理人
export async function getNextFlowUserList({ taskId, type }) {
  return request(`/release/temp/getNextFlowUserList?taskId=${taskId}&type=${type}`, {
    method: 'GET',
  });
}

// 临时发布 流程提交
export async function toSubmit(params) {
  return request(`/release/temp/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 操作清单releaseListEdit
export async function releaseListEdit(params) {
  return request(`/release/temp/operationList`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 清单导出
export async function releaseListsDownload(params) {
  return request(`/release/fileProc/exportList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob',
  });
}
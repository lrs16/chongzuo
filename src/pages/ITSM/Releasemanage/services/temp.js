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

// 发布查询导出/release/fileProc/exportReleaseOrder
export async function exportReleaseOrder(params) {
  return request(`/release/temp/orderListExport`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
    responseType: 'blob',
  });
}

// 删除流程/release/temp/delOrder?releaseNo=xxxx
export async function delOrder(releaseNo) {
  return request(`/release/temp/delOrder?releaseNo=${releaseNo}`, {
    method: 'POST',
  })
}

// 展开清单/release/temp/openList
export async function openList(releaseNo) {
  return request(`/release/temp/openList?releaseNo=${releaseNo}`, {
    method: 'GET',
  })
}

// 临时发布申请表/release/fileProc/exportTempReleaseApply
export async function exportTempReleaseApply(releaseNo) {
  return request(`/release/fileProc/exportTempReleaseApply?releaseNo=${releaseNo}`, {
    method: 'POST',
    requestType: 'formjosn',
    responseType: 'blob',
  })
}
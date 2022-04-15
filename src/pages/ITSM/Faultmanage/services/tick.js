import request from '@/utils/request';

// 抢修票登记 /repair/flow/save
export async function saveTickRegister(params) {
  return request(`/repair/flow/save`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 抢修票提交 /repair/flow/submit
export async function toSubmit(params) {
  return request(`/repair/flow/submit`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 抢修票列表 /repair/flow/list
export async function repairList(params) {
  return request(`/repair/flow/list`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 查询列表导出 /repair/flow/export
export async function exportRepairOrder(params) {
  return request(`/repair/flow/export`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
    responseType: 'blob',
  });
}

// 删除 /repair/flow/delete
export async function delRepairOrder(mainIds) {
  return request(`/repair/flow/delete?mainIds=${mainIds}`, {
    method: 'DELETE',
    data: { mainIds },
  });
}

// 导出word /repair/flow/createReport
export async function exportTickemegentApply(id) {
  return request(`/repair/flow/createReport?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 获取确认人列表 /repair/flow/getUserList
export async function getUserList() {
  return request(`/repair/flow/getUserList`, {
    method: 'GET',
  });
}

// 打开待办，mainId抢修票工单   /repair/flow/openFlow
export async function openRepairFlow(mainId, taskId, todo) {
  if (todo) {
    return request(`/repair/flow/openFlow?mainId=${mainId}&taskId=${taskId}`, {
      method: 'GET',
    });
  } else {
    return request(`/repair/flow/openFlow?mainId=${mainId}`, {
      method: 'GET',
    });
  }
}

// 流程日志 /repair/flow/hisLog
export async function getRepairHisLogList(mainId) {
  return request(`/repair/flow/hisLog?mainId=${mainId}`, {
    method: 'GET',
  });
}

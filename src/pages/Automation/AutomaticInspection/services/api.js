import request from '@/utils/request';

// 根据查询条件显示作业对象数据 空--agent数据
export async function taskObjectList(params, pageNum, pageSize, taskId) {
  return request(`/auto/task/listPageTaskObject/${pageNum}/${pageSize}/${taskId}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ***************主机巡检
// 主机巡检列表 /inspection/host/list
export async function inspectionhostList(params) {
  return request(`/inspect/host/list`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 时钟巡检列表 /inspection/clock/list
export async function inspectionclockList(params) {
  return request(`/inspect/clock/list`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 软件巡检列表 /inspection/soft/list
export async function inspectionsoftList(params) {
  return request(`/inspect/soft/list`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 打开简报 /inspect/host/openBriefing
export async function openhostBriefing(id) {
  return request(`/inspect/host/openBriefing?id=${id}`, {
    method: 'GET',
  });
}

// /inspect/host/saveBriefing 简报保存
export async function saveBriefing(params) {
  return request(`/inspect/host/saveBriefing`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// /inspect/host/downloadBriefing 下载简报
export async function downloadBriefing(id) {
  return request(`/inspect/host/downloadBriefing?id=${id}`, {
    method: 'GET',
  });
}

// 生成巡检 /inspect/host/createInspection 
export async function createInspection(ids) {
  return request(`/inspect/host/createInspection?ids=${ids}`, {
    method: 'POST',
  });
}

// 生成巡检-巡检全部 /inspect/host/createInspection 
export async function createInspectionall() {
  return request(`/inspect/host/createInspection`, {
    method: 'POST',
    requestType: 'form',
  });
}

// 附件ID保存 /inspect/host/saveFileIds
export async function saveFileIds(params) {
  return request(`/inspect/host/saveFileIds`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// /inspect/host/createReport 生成报告
export async function createReport(id) {
  return request(`/inspect/host/createReport?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 信息列表 /inspect/host/infoList
export async function hostinfoList(params) {
  return request(`/inspect/host/infoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// /inspect/host/downloadInfoExcel 下载信息列表
export async function downloadInfoExcel(id) {
  return request(`/inspect/host/downloadInfoExcel?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// /inspect/host/createEvent 生成事件单
export async function createEvent(id) {
  return request(`/inspect/host/createEvent?id=${id}`, {
    method: 'POST',
  });
}


// ***************软件巡检
// 生成软件巡检 /inspect/soft/createInspection
export async function createsoftInspection(ids) {
  return request(`/inspect/soft/createInspection?ids=${ids}`, {
    method: 'POST',
  });
}

// 生成软件巡检-巡检全部 //inspect/soft/createInspection 
export async function createsoftInspectionall() {
  return request(`/inspect/soft/createInspection`, {
    method: 'POST',
    requestType: 'form',
  });
}

// /inspect/soft/createReport 生成报告
export async function createsoftReport(id) {
  return request(`/inspect/soft/createReport?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 软件信息列表 /inspect/soft/infoList
export async function softinfoList(params) {
  return request(`/inspect/soft/infoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// /inspect/soft/downloadInfoExcel 下载软件信息列表
export async function downloadsoftInfoExcel(id) {
  return request(`/inspect/soft/downloadInfoExcel?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// /inspect/soft/createEvent 软件生成事件单
export async function createsoftEvent(id) {
  return request(`/inspect/soft/createEvent?id=${id}`, {
    method: 'POST',
  });
}

// ***************时钟巡检
// 生成时钟巡检 /inspect/clock/createInspection
export async function createclockInspection(ids) {
  return request(`/inspect/clock/createInspection?ids=${ids}`, {
    method: 'POST',
  });
}

// 生成软件巡检-巡检全部 /inspect/clock/createInspection 
export async function createclockInspectionall() {
  return request(`/inspect/clock/createInspection`, {
    method: 'POST',
    requestType: 'form',
  });
}

// 时钟信息列表 /inspect/clock/infoList
export async function clockinfoList(params) {
  return request(`/inspect/clock/infoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// /inspect/clock/downloadInfoExcel 下载时钟信息列表
export async function downloadclockInfoExcel(id) {
  return request(`/inspect/clock/downloadInfoExcel?id=${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}
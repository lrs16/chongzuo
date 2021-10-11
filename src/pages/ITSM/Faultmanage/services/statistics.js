import request from '@/utils/request';

//  故障类型统计列表

export async function faultList(params) {
  return request(`/trouble/stat/statOrderRelateDict`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  数据字典相关字段统计故障工单数据列表,在查询页
export async function relateDictList(params) {
  return request(`/trouble/stat/getOrderRelateDictList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  导出故障汇总统计
export async function faultdownlistDownload(params) {
  return request(`/trouble/stat/expStatOrderRelateDict`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  导出故障明细表
export async function faultDownload(params) {
  return request(`/trouble/stat/expStatOrderByCurrentNodeAndStatus`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  故障状态统计列表
export async function faulthandleGrate(params) {
  return request(`/trouble/stat/statOrderByCurrentNodeAndStatus`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  故障状态统计列表查询页
export async function faulthandleList(params) {
  return request(`/trouble/stat/getOrderByStatusList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  导出问题处理率
export async function handlegrateDownload(params) {
  return request(`/problem/stat/expStatOrderByHandled`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  超时统计列表
export async function timeoutList(params) {
  return request(`/problem/stat/statOrderByTime`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  超时统计的导出
export async function timeoutDownload(params) {
  return request(`/problem/stat/expStatOrderByTime`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

// 故障统计分析
// 工单总情况 /trouble/analysis/getOrderConditions time1, time2, type
export async function queryOrderConditions(params) {
  return request(`/trouble/analysis/getOrderConditions?time1=${params.time1}&time2=${params.time2}&type=${params.type}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障责任单位总情况 /trouble/analysis/getBlameConditions
export async function queryBlameConditions(params) {
  return request(`/trouble/analysis/getBlameConditions?time1=${params.time1}&time2=${params.time2}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障分类总情况 /trouble/analysis/getTypeConditions 
export async function queryTypeConditions(params) {
  return request(`/trouble/analysis/getTypeConditions?time1=${params.time1}&time2=${params.time2}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障模块总情况 /trouble/analysis/getModelConditions 
export async function queryModelConditions(params) {
  return request(`/trouble/analysis/getModelConditions?time1=${params.time1}&time2=${params.time2}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障超时总情况 /trouble/analysis/getTimeOutConditions
export async function queryTimeOutConditions(params) {
  return request(`/trouble/analysis/getTimeOutConditions?time1=${params.time1}&time2=${params.time2}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障登记人排名 /trouble/analysis/getRegisterUserTop
export async function queryRegisterUserTop(params) {
  return request(`/trouble/analysis/getRegisterUserTop?time1=${params.time1}&time2=${params.time2}&num=${params.num}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障登记单位排名 /trouble/analysis/getRegisterUnitTop
export async function queryRegisterUnitTop(params) {
  return request(`/trouble/analysis/getRegisterUnitTop?time1=${params.time1}&time2=${params.time2}&num=${params.num}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障处理人排名 /trouble/analysis/getHandlerTop
export async function queryHandlerTop(params) {
  return request(`/trouble/analysis/getHandlerTop?time1=${params.time1}&time2=${params.time2}&num=${params.num}`, {
      method: 'GET',
      data: { params }
  });
}

// 故障处理单位排名 /trouble/analysis/getHandleUnitTop
export async function queryHandleUnitTop(params) {
  return request(`/trouble/analysis/getHandleUnitTop?time1=${params.time1}&time2=${params.time2}&num=${params.num}`, {
      method: 'GET',
      data: { params }
  });
}

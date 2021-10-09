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
  console.log(params, 'params')
  return request(`/trouble/analysis/getOrderConditions?time1=${params.time1}&time2=${params.time2}&type=${params.type}`, {
      method: 'GET',
      data: { params }
      // data: JSON.stringify(params),
      // requestType: 'formjosn',
      // requestType: 'form',
  });
}
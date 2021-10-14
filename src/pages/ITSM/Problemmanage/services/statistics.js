import request from '@/utils/request';

//  状态列表
export async function statusList(params) {
  return request(`/problem/stat/statOrderByCurrentNodeAndStatus`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  导出状态列表
export async function statusDownload(params) {
  return request(`/problem/stat/expStatOrderByCurrentNodeAndStatus`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

// 问题分类统计
export async function classList(params) {
  return request(`/problem/stat/statOrderRelateDict`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  导出问题分类统计
export async function classDownload(params) {
  return request(`/problem/stat/expStatOrderRelateDict`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  问题解决管控表
export async function handleGrate(params) {
  return request(`/problem/stat/statOrderByHandleProgress`, {
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
  return request(`/problem/stat/statOrderByOverTime`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  超时统计的导出
export async function timeoutDownload(params) {
  return request(`/problem/stat/expStatOrderByOverTime`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  导出问题工单解决进度管控统计结果
export async function solvescheduleDownload(params) {
  return request(`/problem/stat/expStatOrderByHandleProgress`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  问题状态统计列表
export async function problemstatusList(params) {
  return request(`/problem/stat/getOrderByCurrentNodeAndStatus`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  问题统计分析-饼图数据
export async function statpieData(params) {
  return request(`/problem/stat/pieData`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}

//  问题统计分析-趋势图数据
export async function lineData(params) {
  return request(`/problem/stat/lineData`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}
//  问题统计分析-环比数据
export async function statratioData(params) {
  return request(`/problem/stat/ratio`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}

export async function statTop(params) {
  return request(`/problem/stat/top`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}

//  问题统计分析登记人-TOP数据
export async function resgisterstatTop(params) {
  return request(`/problem/stat/top`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}
//  问题统计分析问题处理人Top5数据
export async function handlerstatTop(params) {
  return request(`/problem/stat/top`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}
//  问题统计分析登记单位-TOP数据
export async function resgisterunitstatTop(params) {
  return request(`/problem/stat/top`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}
//  问题处理单位Top5
export async function handleunitstatTop(params) {
  return request(`/problem/stat/top`, {
    method: 'POST',
    data:params,
    requestType:'form'
  });
}




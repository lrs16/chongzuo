import request from '@/utils/request';

// 成功率
export async function successRate(params) {
  return request(`/release/statistic/successRate`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 环节
export async function taskSum(params) {
  return request(`/release/statistic/taskSum`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 清单统计
export async function objSum(params) {
  return request(`/release/statistic/objSum`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 清单列表
export async function objSumList(params) {
  return request(`/release/statistic/objSumList`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 统计分析 发布总情况
export async function analysisSummary(params) {
  return request(`/release/analysis/summary`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
// 统计分析 环节统计情况（平台验证、业务验证、发布验证、业务复核情况）
export async function taskStatistical(params) {
  return request(`/release/analysis/taskStatistical`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 发布责任单位情况 /release/analysis/unitStatistical
export async function unitStatistical(params) {
  return request(`/release/analysis/unitStatistical`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 发布类型统计/release/analysis/typeStatistical
export async function typeStatistical(params) {
  return request(`/release/analysis/typeStatistical`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 发布超时总情况
export async function timeOutOrder(params) {
  return request(`/release/analysis/timeOutOrder`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 超时环节TOP5
export async function timeOutTask(params) {
  return request(`/release/analysis/timeOutTask`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 /release/analysis/unitTimeOut责任单位超时
export async function unitTimeOut(params) {
  return request(`/release/analysis/unitTimeOut`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 /release/analysis/assigneeTimeOut 责任人超时
export async function assigneeTimeOut(params) {
  return request(`/release/analysis/assigneeTimeOut`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 统计分析 /release/analysis/abilityTimeOut功能类型统计
export async function abilityTimeOut(params) {
  return request(`/release/analysis/abilityTimeOut`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

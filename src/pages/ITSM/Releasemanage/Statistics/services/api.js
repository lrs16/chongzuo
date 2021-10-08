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
// 统计分析 环节统计情况（平台验证、业务验证、发布实施、业务复核情况）
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

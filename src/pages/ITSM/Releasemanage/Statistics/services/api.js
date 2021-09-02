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
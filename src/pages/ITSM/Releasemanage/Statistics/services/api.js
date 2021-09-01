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
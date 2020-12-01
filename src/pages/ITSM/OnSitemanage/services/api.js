import request from '@/utils/request';

// 报告列表
export async function queryCheckList(currentPage, pageSize) {
  return request(`/inspection/report/reportList?currentPage=${currentPage}&pageSize=${pageSize}`, {
    method: 'GET',
  });
}

// 执行巡检
export async function querydoCheck() {
  return request(`/inspection/check/docheck`, {
    method: 'GET',
  });
}

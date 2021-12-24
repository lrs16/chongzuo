import request from '@/utils/request';

// 报告列表
export async function queryCheckList(currentPage, pageSize) {
  return request(`/inspection/report/reportList?currentPage=${currentPage}&pageSize=${pageSize}`, {
    method: 'GET',
  });
}

// 计量主站巡检
export async function querydoCheck() {
  return request(`/inspection/check/docheck`, {
    method: 'GET',
  });
}

// 网级平台巡检
export async function querywholeNet() {
  return request(`/wholeNet/inspection/wholeNet/check`, {
    method: 'GET',
  });
}

// 网级平台巡检继续巡检
export async function goonwholeNet(checkNo) {
  return request(`/wholeNet/inspection/wholeNet/check?checkNo=${checkNo}`, {
    method: 'GET',
  });
}

// 下载文件
export async function downloadreport(checkNo) {
  return request(`/inspection/report/download?checkNo=${checkNo}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

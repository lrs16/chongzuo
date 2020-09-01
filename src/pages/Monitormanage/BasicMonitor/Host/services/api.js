import request from '@/utils/request';

// 请求主机列表
export async function querylisthost(current, pageSize) {
  return request(`/basicMonitor/hostMonitor/host?current=${current}&pageSize=${pageSize}`, {
    method: 'GET',
  });
}

// 请求主机详情页顶部radiogroup
export async function queryapplication(id) {
  return request(`/basicMonitor/hostMonitor/application/${id}`, {
    method: 'GET',
  });
}

// 请求主机详情页，监控指标，最近一次 /hostMonitor/currentHistory/{applicationId}
export async function querycurrentHistory(applicationId) {
  return request(`/basicMonitor/hostMonitor/currentHistory/${applicationId}`, {
    method: 'GET',
  });
}

// 请求主机详情页，监控指标，指定时间 /hostMonitor/history
export async function queryotherhistory(applicationId, formTime, toTime) {
  // console.log(applicationId,formTime,toTime);
  return request(
    `/basicMonitor/hostMonitor/history?applicationId=${applicationId}&formTime=${formTime}&toTime=${toTime}`,
    {
      method: 'GET',
    },
  );
}

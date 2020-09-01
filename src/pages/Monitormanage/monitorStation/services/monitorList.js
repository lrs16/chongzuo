import request from '@/utils/request';

// // 请求
// export async function querylisthost(current, pageSize) {
//   return request(`/basicMonitor/monitor/listHost?current=${current}&pageSize=${pageSize}`, {
//     method: 'POST',
//   });
// }

export async function querylisthost() {
  return request(`/api/mockhostlist`, {
    method: 'GET',
    // body:{current,pageSize}
  });
}

export async function querylistdatabase(current, pageSize) {
  return request(`/basicMonitor/monitor/listDataBase?current=${current}&pageSize=${pageSize}`, {
    method: 'POST',
  });
}

export async function queryMonitorGroup() {
  return request(`/basicMonitor/monitor/listMonitorGroup`, {
    method: 'GET',
  });
}

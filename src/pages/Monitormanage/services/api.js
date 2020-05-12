import { stringify } from 'qs';
import request from '@/utils/request';

// // 请求
export async function querylisthost(current, pageSize) {
  console.log(current, current);
  return request(`/basicMonitor/monitor/listHost?current=${current}&pageSize=${pageSize}`, {
    method: 'POST',
  });
}

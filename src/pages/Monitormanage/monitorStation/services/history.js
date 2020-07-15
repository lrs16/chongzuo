import request from '@/utils/request';

export async function queryHistory(params) {
  const { hostId, fromDate, toDate } = params;
  return request(
    `/basicMonitor/monitor/getHostInfo?fromDate=${fromDate}&hostId=${hostId}&toDate=${toDate}`,
    {
      method: 'POST',
      data: params,
    },
  );
}

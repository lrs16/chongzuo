import { stringify } from 'qs';
import request from '@/utils/request';

// 指标环比数据：抄表率
export async function queryKpicblList(params) {
  console.log(params);
  return request(`/monitor/kpiData/cbl`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//指标环比数据：覆盖率
export async function queryKpifglList(params) {
  return request(`/monitor/kpiData/fgl`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//指标环比数据：完整率
export async function queryKpiwzlList(params) {
  console.log(params);
  return request(`/monitor/kpiData/wzl`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

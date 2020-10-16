import { stringify } from 'qs';
import request from '@/utils/request';

// 指标环比数据：抄表率
export async function queryKpizbhbList(params) {
  const { currentPage, gddwmc, gldwlxbm, lb, mc, pageSize } = params;
  return request(
    `/monitor/kpiData/zbhb?currentPage=${currentPage}&gddwmc=${gddwmc}&gldwlxbm=${gldwlxbm}&lb=${lb}&mc=${mc}&pageSize=${pageSize}`,
    {
      method: 'GET',
    },
  );
}

//抽数
export async function queryextractData() {
  return request(`monitor/extractData/zbhb`, {
    method: 'GET',
  });
}

import { stringify } from 'qs';
import request from '@/utils/request';
// 请求脚本列表
export async function queryTreecompactdata(params) {
  return request(`/api/queryTreecompact_data?${stringify(params)}`);
}

export async function queryFacadata(params) {
  return request(`/api/queryfaca_data?${stringify(params)}`);
}

import request from '@/utils/request';

// 查询列表
export async function queryEventList(params) {
  return request(`/api/event/queryList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

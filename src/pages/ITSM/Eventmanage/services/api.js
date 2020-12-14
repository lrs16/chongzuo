import request from '@/utils/request';

// 事件待办
export async function queryEventodoList(params) {
  return request(`/api/event/queryTodoList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 事件查询
export async function queryList(params) {
  return request(`/api/event/queryList`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

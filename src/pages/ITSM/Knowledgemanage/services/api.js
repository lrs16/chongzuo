import request from '@/utils/request';

// 获取列表信息
export async function queryTodoList() {
  return request(`/api/release/todolist`, {
    method: 'GET',
  });
}
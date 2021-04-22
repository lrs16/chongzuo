import request from '@/utils/request';

// 启动获取用户信息
export async function queryTodoList() {
  return request(`/api/release/todolist`, {
    method: 'GET',
  });
}
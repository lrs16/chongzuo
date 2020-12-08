import request from '@/utils/request';

export async function problemList() {
  return request(`GET /api/problemList`);
}
import { stringify } from 'qs';
import request from '@/utils/request';

// 运维场景：请求列表
export async function querySeceneList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

// 运维场景：删除
export async function removeSeceneList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}
// 运维场景：增加
export async function addSeceneList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

// 运维场景：编辑
export async function updateSeceneList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

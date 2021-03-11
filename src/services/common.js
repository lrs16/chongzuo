import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryUnitList(params) {
  return request(`/common/function/findUnit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function queryDeptList(params) {
  return request(`/common/function/findDept`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 获取报障用户 /common/disableduser/getDisableduserByUser
export async function queryDisableduserByUser(params) {
  return request(`/common/disableduser/getDisableduserByUser`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

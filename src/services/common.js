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

// 关联工单 故障
export async function getTroubleList(params) {
  return request(`/common/relation/getTroubleList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 关联工单 问题
export async function getProblemList(params) {
  return request(`/common/relation/getProblemList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 关联工单 事件
export async function getEventList(params) {
  return request(`/common/relation/getEventList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 关联工单 需求
export async function getDemandList(params) {
  return request(`/common/relation/getDemandList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 关联工单 发布
export async function getReleaseList(params) {
  return request(`/common/relation/getDemandList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 关联工单列表
export async function queryOrderRelationList(params) {
  return request(`/common/relation/queryOrderRelationList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 关联工单保存
export async function saveRelation(params) {
  return request(`/common/relation/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function queryOrder(params) {
  return request(`/report/queryOrder`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

//  获取系统用户信息
export async function operationPerson() {
  return request(`/upms/user`);
}
import request from '@/utils/request';

//  保存所有表单
export async function saveForm(params) {
  return request(`/operation/flow/save`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  我的作业计划列表
export async function myTasklist(params) {
  return request(`/api/myTasklist`)
}
import request from '@/utils/request';

// 人员进出登记 保存新增人员进出申请表单
export async function addApplyForm(params) {
  return request(`/regist/form/saveOrUpdate`, {
    method: 'POST',
    data: params,
    // requestType: 'form'
  })
}

//  人员进出登记 人员进出登记列表
export async function findRegistList(params) {
  return request(`/regist/form/findRegistList`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}

//  人员进出登记 进出人员信息删除
export async function deleteApplyForms(registIds) {
  return request(`/regist/form/deleteRegist`, {
    method: 'DELETE',
    data: registIds,
    requestType: 'form',
  })
}

//  人员进出登记-导出
export async function downloadRegistExport(params) {
  return request(`/regist/form/downloadExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob'
  })
}

//  人员进出审核-导出
export async function downloadCheckExport(params) {
  return request(`/regist/form/downloadCheckExcel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob'
  })
}

//  人员进出登记-送审
export async function sendCheck(params) {
  return request(`/regist/form/sendCheck`, {
    method: 'POST',
    data: params,
    // requestType: 'form',
  })
}

//  人员进出登记 人员进出审核列表
export async function findCheckList(params) {
  return request(`/regist/form/findCheckList`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  })
}


//  人员进出审核 审核
export async function checkRegist(params) {
  return request(`/regist/form/checkRegist`, {
    method: 'POST',
    data: params,
  })
}

//  人员进出审核 审核保存
export async function saveCheck(params) {
  return request(`/regist/form/saveCheck`, {
    method: 'POST',
    data: params,
  })
}
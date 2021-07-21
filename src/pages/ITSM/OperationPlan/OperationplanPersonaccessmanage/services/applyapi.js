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
export async function deleteApplyForm(registId) {
  return request(`/regist/form/${registId}`, {
    method: 'DELETE',
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

//  人员进出登记-审核
export async function checkRegist(params) {
  return request(`/regist/form/checkRegist`, {
    method: 'POST',
    data: params,
    // requestType: 'form',
  })
}
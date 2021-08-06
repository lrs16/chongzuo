import request from '@/utils/request';

export async function maintenanceList () {
  return request(`/api/quality/maintenanceList`)
}

export async function tobeDealtdata () {
  return request(`/api/quality/tobeDealtdata`)
}

// 保存登记环节信息
export async function assessRegister(params) {
  return request(`/quality/assess/register`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

// 保存服务商确认环节信息
export async function saveDirectorReview(params) {
  return request(`/quality/assess/saveDirectorReview`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}
// 保存业务负责人审核环节信息
export async function saveDirectorVerify(params) {
  return request(`/quality/assess/saveDirectorVerify`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}
// 保存自动化科专责审核环节信息
export async function saveExpertVerify(params) {
  return request(`/quality/assess/saveExpertVerify`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}
// 保存服务商确认环节信息
export async function saveProviderConfirm(params) {
  return request(`/quality/assess/saveProviderConfirm`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  根据考核类型查询一级指标
export async function scoreGetTarget1(type) {
  return request(`/quality/score/getTarget1?type=${type}`)
}

//  根据考核类型查询二级指标
export async function scoreGetTarget2(id) {
  return request(`/quality/score/getTarget2?target1=${id}`)
}

//  获取环节数据
export async function getTaskData(taskId) {
  return request(`/quality/assess/getTaskData/?taskId=${taskId}`)
}



import request from '@/utils/request';

export async function maintenanceList () {
  return request(`/api/quality/maintenanceList`)
}

//  待办列表
export async function tobeDealtdata (params) {
  return request(`/quality/assess/todolist/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
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
export async function getTaskData(assessNo) {
  return request(`/quality/assess/openFlow/?assessNo=${assessNo}`)
}

//  流程传递
export async function assessComplete(params) {
  return request(`/quality/assess/complete?taskId=${params.taskId}&users=${params.users}`,{
    method:'POST',
    // body:JSON.stringify(params)
  })
}


//  积分卡登记
export async function scorecardSave(params) {
  return request(`/quality/scorecard/save`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

// 登记卡详情
export async function scorecardId(id) {
  return request(`/quality/scorecard/${id}`)
}

//  积分卡列表
export async function scorecardlistPage(params) {
  return request(`/quality/scorecard/listPage/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  删除计分卡
export async function scorecardDel(id) {
  return request(`/quality/scorecard/del/${id}`,{
    method:'POST'
  })
}

// 记分卡提交
export async function scorecardSubmit(cardId) {
  return request(`/quality/scorecard/submit`,{
    method:'POST',
    data:JSON.stringify(cardId)
  })
}


//  计分卡导出
export async function scorecardExport(params) {
  return request(`/quality/scorecard/export`,{
    method:'POST',
    data:JSON.stringify(params),
    responseType:'blob',
  })
}

//  保存服务绩效考核确认环节信息
export async function saveFinallyConfirm(params) {
  return request(`/quality/assess/saveFinallyConfirm`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  获取工单流程历史数据
export async function hisTask(instanceId) {
  return request(`/quality/assess/hisTask?instanceId=${instanceId}`,{
    method:'POST'
  })
}

//  删除工单
export async function assessDelete(assessNo) {
  return request(`/quality/assess/delete?assessNo=${assessNo}`)
}

//  回退
export async function rollback(taskId) {
  return request(`/quality/assess/rollback?taskId=${taskId}`,{
    method:'POST',
  })
}

//  流程图
export async function readResource(processInstanceId) {
  return request(`/activiti/process/readResource/${processInstanceId}`,{
    method:'GET',
    responseType: 'blob',
  })
}

//  下载服务绩效待办
export async function exportTodolist(params) {
  return request(`/quality/assess/export/todolist`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  服务绩效查询
export async function assessSearch(params) {
  return request(`/quality/assess/search/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  我的服务绩效查询
export async function assessmyAssess(params) {
  return request(`/quality/assess/myAssess/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  导出服务绩效查询
export async function exportSearch(params) {
  return request(`/quality/assess/export/search`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}
//  导出我的服务绩效
export async function exportmyAssess(params) {
  return request(`/quality/assess/export/myAssess`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}


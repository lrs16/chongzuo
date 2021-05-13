import request from '@/utils/request';


//  启动流程
export async function startFlow() {
  return request(`/operation/flow/add`); 
}
//  保存所有表单
export async function saveForm(params) {
  return request(`/operation/flow/save`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  打开待办
export async function openFlow(mainId) {
  return request(`/operation/flow/openFlow?mainId=${mainId}`)
}

//  我的作业计划列表
export async function myTasklist(params) {
  return request(`/operation/form/findMyOperation`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  送审提交
export async function censorshipSubmit(submitParams) {
  return request(`/operation/flow/batchToCheck`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}

//  下载我的工作计划
export async function downloadMyOperationExcel(params) {
  console.log('params: ', params);
  return request(`/operation/form/downloadMyOperationExcel`,{
    method:'POST',
    data:params,
    // body:JSON.stringify(params),
    requestType:'form',
    responseType:'blob'
  })
}

//  回退
export async function fallback(params) {
  return request(`/operation/flow/fallback`,{
    method:'POST',
    data: params,
    requestType: 'form'
  })
}



//  单条或者批量审核
export async function batchCheck(submitParams) {
  return request(`/operation/flow/batchCheck`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}
//  单条或者批量送审
export async function batchToCheck(submitParams) {
  return request(`/operation/flow/batchToCheck`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}

//  我的作业计划查询
export async function getOperationQueryList(params) {
  return request(`/operation/form/getOperationQueryList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  我的作业计划查询详情
export async function openView(params) {
  return request(`/operation/form/openView?mainId=${params}`)
}

//  单条或者批量删除
export async function taskDelete(submitParams) {
  return request(`/operation/flow/delete`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}

//  确定执行
export async function submit(submitParams) {
  return request(`/operation/flow/submit`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}

//  下载工作计划查询
export async function downloadQueryExcel(params) {
  return request(`/operation/form/downloadQueryExcel`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType: 'form'
  })
}

//  确定延期
export async function delay(submitParams) {
  return request(`/operation/flow/delay`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}


//  获取作业负责人信息
export async function operationPerson() {
  console.log(111)
  return request(`/upms/user`);
}
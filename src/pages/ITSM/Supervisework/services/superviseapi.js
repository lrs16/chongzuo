import request from '@/utils/request';

//  启动流程
export async function startFlow() {
  return request(`/work/flow/add`); 
}

//  保存所有表单
export async function saveForm(params) {
  return request(`/work/flow/save`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  填报表单提交到工作负责人
export async function submitForm(params) {
  return request(`/work/flow/submit`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  打开待办
export async function openFlow(mainId) {
  return request(`/work/flow/openFlow?mainId=${mainId}`)
}

//  工作列表
export async function getMyWorkList(params) {
  return request(`/work/form/getMyWork`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  工作督办查询列表
export async function getWorkQueryList(params) {
  return request(`/work/form/getWorkQueryList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

// //  送审提交
// export async function censorshipSubmit(submitParams) {
//   return request(`/operation/flow/batchToCheck`,{
//     method:'POST',
//     data: submitParams,
//     requestType: 'form'
//   })
// }

//  保存督办
export async function saveSupervise(params) {
  return request(`/work/flow/saveSupervise`,{
    method:'POST',
    data: params,
    requestType:'form'
  })
}

//  导出-我的创建工作
export async function downloadMyWorkExcel(params) {
  return request(`/work/form/downloadMyWorkExcel`,{
    method:'POST',
    data:params,
    requestType:'form',
    responseType:'blob'
  })
}

//  导出-工作查询列表
export async function downloadWorkQueryExcel(params) {
  return request(`/work/form/downloadWorkQueryExcel`,{
    method:'POST',
    data:params,
    requestType:'form',
    responseType:'blob'
  })
}

// //  回退
// export async function fallback(params) {
//   return request(`/operation/flow/fallback`,{
//     method:'POST',
//     data: params,
//     requestType: 'form'
//   })
// }

// //  单条或者批量审核
// export async function batchCheck(submitParams) {
//   return request(`/operation/flow/batchCheck`,{
//     method:'POST',
//     data: submitParams,
//     requestType: 'form'
//   })
// }

// //  单条或者批量送审
// export async function batchToCheck(submitParams) {
//   return request(`/operation/flow/batchToCheck`,{
//     method:'POST',
//     data: submitParams,
//     requestType: 'form'
//   })
// }

// //  我的作业计划查询
// export async function getOperationQueryList(params) {
//   return request(`/operation/form/getOperationQueryList`,{
//     method:'POST',
//     data:params,
//     requestType:'form'
//   })
// }

// //  我的作业计划查询详情
// export async function openView(params) {
//   return request(`/operation/form/openView?mainId=${params}`)
// }

//  单条或者批量删除
export async function taskDelete(submitParams) {
  return request(`/work/flow/delete`,{
    method:'POST',
    data: submitParams,
    requestType: 'form'
  })
}

// //  确定执行
// export async function submit(submitParams) {
//   return request(`/operation/flow/submit`,{
//     method:'POST',
//     data: submitParams,
//     requestType: 'form'
//   })
// }

// //  下载工作计划查询
// export async function downloadQueryExcel(params) {
//   return request(`/operation/form/downloadQueryExcel`,{
//     method:'POST',
//     responseType:'blob',
//     data:params,
//     requestType: 'form'
//   })
// }

// //  确定延期
// export async function delay(submitParams) {
//   return request(`/operation/flow/delay`,{
//     method:'POST',
//     data: submitParams,
//     requestType: 'form'
//   })
// }

//  获取工作负责人信息
export async function getWorkUserList() {
  return request(`/work/flow/getWorkUserList`, {
    method: 'GET',
  });
}
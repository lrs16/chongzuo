import request from '@/utils/request';

// //  作业结果统计
export async function executeResult(params) {
  return request(`/operation/statis/executeResult?time1=${params.startTime}&time2=${params.endTime}`); 
}

// 作业计划状态统计
export async function operationStatus(params) {
  return request(`/operation/statis/operationStatus?time1=${params.startTime}&time2=${params.endTime}`); 
}

// //  超时状态统计
export async function timeoutStatus(params) {
  return request(`/operation/statis/timeoutStatus?time1=${params.startTime}&time2=${params.endTime}`); 
}

// //  执行情况统计
export async function userExecuteStatus(params) {
  return request(`/operation/statis/userExecuteStatus?time1=${params.startTime}&time2=${params.endTime}`); 
}

//  下载类
//  作业结果统计
export async function downloadExecuteResult(params) {
  return request(`/operation/statis/downloadExecuteResult`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  作业计划状态统计
export async function downloadOperationStatus(params) {
  return request(`/operation/statis/downloadOperationStatus`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  超时状态统计
export async function downloadTimeoutStatus(params) {
  return request(`/operation/statis/downloadTimeoutStatus`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  执行情况统计
export async function downloadUserExecuteStatus(params) {
  return request(`/operation/statis/downloadUserExecuteStatus`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}




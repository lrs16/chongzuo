import request from '@/utils/request';

//  功能需求统计列表
export async function demandRequirementlist(params) {
    return request(`/demand/statisstics/features?startTime=${params.statTimeBegin}&endTime=${params.statTimeEnd}`); 
}

// //  需求状态统计列表
export async function demandstateList(params) {
  return request(`/demand/statisstics/status?startTime=${params.statTimeBegin}&endTime=${params.statTimeEnd}`); 
}

// //  一线事件解决情况列表
export async function eventselfhandleList(params) {
  return request(`/event/statis/eventSelfHandle?time1=${params.startTime}&time2=${params.endTime}`); 
}

// // 工单TOPN列表
export async function eventtopnList(params) {
  return request(`/event/statis/eventTOPN?num=${params.value}&time1=${params.startTime}&time2=${params.endTime}`); 
}

// //  工单处理率列表
export async function eventhandlerateList(params) {
  return request(`/event/statis/eventHandleRate?time1=${params.startTime}&time2=${params.endTime}`); 
}

//  下载类

//  下载功能需求统计
export async function requirementDownload(params) {
  return request(`/demand/statisstics/excelFeatures?startTime=${params.statTimeBegin}&endTime=${params.statTimeEnd}`,{
    responseType:'blob',
    requestType:'form'
  })
}

//  下载需求状态统计
export async function demandstateDownload(params) {
  return request(`/demand/statisstics/excelStatus?startTime=${params.statTimeBegin}&endTime=${params.statTimeEnd}`,{
    responseType:'blob',
    requestType:'form'
  })
}

//  下载运维一线解决统计
export async function eventselfhandleDownload(params) {
  return request(`/event/statis/downloadEventSelfHandle`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  下载工单top
export async function eventtopnDownload(params) {
  return request(`/event/statis/downloadEventTOPN`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  下载事件处理率
export async function eventhandlerateDownload(params) {
  return request(`/event/statis/downloadEventHandleRate`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

// 数据字典结构树 /sys/dict/keyVal
export async function querkeyVal(params) {
  return request(`/sys/dict/keyVal`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}




import request from '@/utils/request';

//  运维分类情况统计列表
export async function maintenanceList(params) {
    return request(`/event/statis/eventObjectStatis?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}

// //  运维服务指标统计列表
export async function eventServiceList(params) {
  return request(`/event/statis/eventServiceIndicators?time1=${params.startTime}&time2=${params.endTime}&type=${params.tabActiveKey}`); 
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
  return request(`/event/statis/eventHandleRate?time1=${params.startTime}&time2=${params.endTime}&type=${params.type}`); 
}

//  下载类
//  运维分类情况统计
export async function maintenanceDownload(params) {
  return request(`/event/statis/downloadEventObjectStatis`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  下载运维服务指标统计
export async function eventserviceDownload(params) {
  return request(`/event/statis/downloadEentServiceIndicators`,{
    method:'POST',
    responseType:'blob',
    data:params,
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

// 工单处理率详情页
export async function getEventHandleRateList(params) {
  return request(`/event/form/getEventHandleRateList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  工单处理率下载
export async function downloadEventHandleRateListExcel(params) {
  return request(`/event/form/downloadEventHandleRateListExcel`,{
    method:'POST',
    responseType:'blob',
    data:params,
    requestType:'form'
  })
}

//  可视化分析接口
// // 事件处理人排名
export async function getHandlerTop(params) {
  return request(`/event/analysis/getHandlerTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}
// 事件处理单位排名
export async function getHandleUnitTop(params) {
  return request(`/event/analysis/getHandleUnitTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}

// 事件对象总情况
export async function getObjectConditions(params) {
  return request(`/event/analysis/getObjectConditions`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}
// 事件工单总情况
export async function getOrderConditions(params) {
  return request(`/event/analysis/getOrderConditions`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}
// 事件登记单位排名
export async function getRegisterUnitTop(params) {
  return request(`/event/analysis/getRegisterUnitTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}
// 事件登记人排名
export async function getRegisterUserTop(params) {
  return request(`/event/analysis/getRegisterUserTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}
// 事件超时总情况
export async function getTimeOutConditions(params) {
  return request(`/event/analysis/getTimeOutConditions`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}
// 事件分类总情况
export async function getTypeConditions(params) {
  return request(`/event/analysis/getTypeConditions`,{
    method:'POST',
    data:params,
    requestType:'form'
  }); 
}

// 事件超时处理人
export async function getTimeoutHandlerTop(params) {
  return request(`/event/analysis/getTimeoutHandlerTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}




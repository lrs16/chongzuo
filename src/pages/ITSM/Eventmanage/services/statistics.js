import request from '@/utils/request';

//  运维分类情况统计列表
export async function maintenanceList(params) {
  return request(`/event/statis/eventObjectStatis?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}

//  运维服务指标统计列表
export async function eventServiceList(params) {
  return request(`/event/statis/eventServiceIndicators?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}

//  一线事件解决情况列表
export async function eventselfhandleList(params) {
  return request(`/event/statis/eventSelfHandle?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}

// 工单TOPN列表
export async function eventtopnList(params) {
  return request(`/event/statis/eventTOPN?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}

//  工单处理率列表
export async function eventhandlerateList(params) {
  return request(`/event/statis/eventHandleRate?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}
import request from '@/utils/request';

//  运维分类情况统计列表
export async function maintenanceList(params) {
  console.log(maintenanceList,'maintenanceList');
  switch(params.sign) {
    case 'maintenance':
      return request(`/event/statis/eventObjectStatis?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
    case 'maintenanceservice':
      return request(`/event/statis/eventServiceIndicators?time1=${params.startTime}&time2=${params.endTime}&type=${params.tabActiveKey}`); 
    case 'solution':
      return request(`/event/statis/eventSelfHandle?time1=${params.startTime}&time2=${params.endTime}`);
    case 'workordertopn':
      return request(`/event/statis/eventTOPN?type=1&time1=${params.startTime}&time2=${params.endTime}`); 
    case 'workordertreatmentrate':
      return request(`/event/statis/eventHandleRate?time1=${params.startTime}&time2=${params.endTime}`); 
    default:
      break;
  }
  return true;
}

// //  运维服务指标统计列表
// export async function eventServiceList(params) {
//   return request(`/event/statis/eventServiceIndicators?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
// }

// //  一线事件解决情况列表
// export async function eventselfhandleList(params) {
//   return request(`/event/statis/eventSelfHandle?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
// }

// // 工单TOPN列表
// export async function eventtopnList(params) {
//   return request(`/event/statis/eventTOPN?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
// }

// //  工单处理率列表
// export async function eventhandlerateList(params) {
//   return request(`/event/statis/eventHandleRate?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
// }


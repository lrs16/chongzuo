import request from '@/utils/request';

//  运维分类情况统计列表
export async function maintenanceList(params) {
  return request(`/event/statis/eventObjectStatis?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`);
  
  
}
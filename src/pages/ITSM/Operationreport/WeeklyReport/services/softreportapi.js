import request from '@/utils/request';

//  一·本周运维情况综述表格数据
export async function maintenanceData() {
  return request(`/api/maintenanceData`);
}

//  二·常规运维工作开展情况
export async function developmentData() {
  return request(`/api/developmentData`);
}

//  常规运维工作开展情况第二个表格
export async function submitdevelopmentData() {
  return request(`/api/submitdevelopmentData`);
}

//  三、运维服务指标完成情况 ----第一个表格
export async function serviceCompletion() {
  return request(`/api/serviceCompletion`);
}
//  三、运维服务指标完成情况 ----第二个表格
export async function serviceCompletiontwo() {
  return request(`/api/serviceCompletiontwo`);
}
//  三、运维服务指标完成情况 ----第三个表格
export async function serviceCompletionthree() {
  return request(`/api/serviceCompletionthree`);
}

//  四、本周事件、问题及故障表格数据
export async function thisWeekitsm() {
  return request(`/api/thisWeekitsm`);
}

//  五、软件作业完成情况第一个表格
export async function completionfirstlyTable() {
  return request(`/api/completionfirstlyTable`);
}

//  五、软件作业完成情况第二个表格
export async function completionsecondTable() {
  return request(`/api/completionsecondTable`);
}

//  六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况（使用表格管理作为附件）
export async function remainingDefects() {
  return request(`/api/remainingDefects`);
}

//  七、上周作业完成情况--表格
export async function lastweekHomework() {
  return request(`/api/lastweekHomework`);
}
//  七、下周作业完成情况--表格
export async function nextweekHomework() {
  return request(`/api/NextweekHomework`);
}
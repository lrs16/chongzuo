import request from '@/utils/request';

//  新增周报，获取maindId
export async function addReport() {
  return request(`/report/add`,{
    method:'POST'
  })
}
//  删除，获取maindId
export async function deleteAll(ids) {
  return request(`/report/delete`,{
    method:'POST',
    data:ids,
    requestType:'form'
  })
}
//  下载
export async function exportdown(mainId) {
  return request(`/report/export`,{
    method:'POST',
    data:mainId,
    requestType:'form'
  })
}
//  查询列表
export async function queryList(params) {
  console.log('params: ', params);
  return request(`/report/queryList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}
// //  软件运维查询工单
export async function queryOrder(params) {
  return request(`/report/queryOrder`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

// 保存软件运维周报
export async function saveSoftreport(params) {
  const result = params;
   delete result.reporttype;
  // delete params.reporttype;
  return request(`/report/saveSoftWare`,{
    method:'POST',
    data:result,
    requestType:'form'
  })
}
// 保存数据库周报
export async function saveDataBase(params) {
  return request(`/report/saveDataBase`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}
// 保存其他运维周报
export async function saveOther(params) {
  return request(`/report/saveOther`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}
// 保存机房周报
export async function saveComputerRoom(params) {
  return request(`/report/saveComputerRoom`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

 // 打开周报
export async function openReport(editStatus,id) {
  return request(`/report/openReport?editStatus=${editStatus}&id=${id}`)
}
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
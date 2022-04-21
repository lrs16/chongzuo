import request from '@/utils/request';


//  从统计获取数据
//  运维分类情况统计列表
export async function maintenanceList(params) {
  return request(`/event/statis/eventObjectStatis?type=${params.tabActiveKey}&time1=${params.startTime}&time2=${params.endTime}`); 
}

// // 工单TOPN列表
export async function eventtopnList(params) {
  return request(`/event/statis/eventTOPN?num=${params.value}&time1=${params.startTime}&time2=${params.endTime}`); 
}

// //  运维服务指标统计列表
export async function eventServiceList(params) {
  return request(`/event/statis/eventServiceIndicators?time1=${params.startTime}&time2=${params.endTime}&type=${params.tabActiveKey}`); 
}

// //  一线事件解决情况列表
export async function eventselfhandleList(params) {
  return request(`/event/statis/eventSelfHandle?time1=${params.startTime}&time2=${params.endTime}`); 
}

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

//  我的作业计划查询
export async function getOperationQueryList(params) {
  return request(`/operation/form/getOperationQueryList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

// /trouble/flow/getOrderPage 获取故障工单列表 故障查询列表
export async function queryfaultSearchList1(params) {
  return request(`/report/queryTrouble`, {
    method: 'POST',
    requestType:'form',
    data:params
  });
}

// 导出word
export async function reportExport(mainId) {
  return request(`/report/export`,{
    method:'POST',
    data:{mainId},
    requestType:'form',
    responseType:'blob'
  })
}

//  获取运维情况综述行
export async function getContentRow(params) {
  return request(`/report/getContentRow`,{
    method:'POST',
    data:params,
    requestType:'form',
  })
}

//  获取运维巡检
export async function getPatrolAndExamineList(params) {
  return request(`/report/getPatrolAndExamineList`,{
    method:'POST',
    data:params,
    requestType:'form',
  })
}

//  保存机房月报
export async function saveComputerRoomByMonth(params) {
  return request(`/report/saveComputerRoomByMonth`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}


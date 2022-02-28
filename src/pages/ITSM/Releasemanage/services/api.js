import request from '@/utils/request';

// 启动待办信息  /release/from/findTodoList
export async function queryTodoList(params) {
  return request(`/release/from/findTodoList`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}
// export async function queryTodoList() {
//   return request(`/api/release/todolist`, {
//     method: 'GET',
//   });
// }

// 启动流程 /release/flow/start
export async function startFlow() {
  return request(`/release/flow/start`, {
    method: 'GET',
  });
}

// 获取下一节点处理人列表 /release/flow/getNextFlowUserList
export async function nextFlowUserList() {
  return request(`/release/flow/getNextFlowUserList`, {
    method: 'GET',
  });
}

// 出厂测试保存
export async function saveRegister(params) {
  return request(`/release/flow/saveRegister`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 开发商项目经理审核 保存
export async function saveDevmanageCheck(params) {
  return request(`/release/flow/saveDevmanageCheck`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 平台验证保存
export async function saveplatformValid(params) {
  return request(`/release/flow/savePlatformValid`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 系统运维商经理审核保存
export async function saveDevopsCheck(params) {
  return request(`/release/flow/saveDevopsCheck`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 业务验证保存
export async function savereleaseBizValid(params) {
  return request(`/release/flow/saveBizValid`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布验证准备保存
export async function savePracticePre(params) {
  return request(`/release/flow/savePracticePre`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 流程提交
export async function flowSubmit(params) {
  return request(`/release/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 打开待办
export async function openFlow(releaseNo) {
  return request(`/release/flow/openFlow?releaseNo=${releaseNo}`, {
    method: 'GET',
  });
}

// 删除发布清单/release/from/releaseListDel
export async function releaseListDel(params) {
  return request(`/release/from/releaseListDel`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 编辑发布清单，清单id为空时为添加/release/from/releaseListSingleEdit,业务验证待办、版本管理员审核用到
export async function releaseListEdit(params) {
  return request(`/release/from/releaseListSingleEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 分派清单
export async function releaseListAssign(params) {
  return request(`/release/from/dispatchBizTodo`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务验证待办列表
export async function bizTodoList(params) {
  return request(`/release/from/bizTodoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务复核待办列表
export async function bizCheckTodo(params) {
  return request(`/release/from/bizCheckTodo`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


// 打开业务验证 /release/from/openBizTodoList
export async function openBizTodoList(params) {
  return request(`/release/from/openBizTodoList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务验证查看清单/release/from/openBizTodoView
export async function openBizTodoView(params) {
  return request(`/release/from/openBizTodoView`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 业务验证完成 /release/from/completeVerify
export async function completeVerify(params) {
  return request(`/release/from/completeVerify`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布实施准备导出/release/fileProc/expPracticePre?taskId=982521
export async function expPracticePre(taskId) {
  return request(`/release/fileProc/expPracticePre?taskId=${taskId}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 文件下载-发布附件模板下载
export async function downloadAttachTemplate(fileName) {
  return request(`/release/fileProc/downloadAttachTemplate?fileName=${fileName}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 版本管理员合并工单/release/flow/mergeOrders
export async function mergeOrders(params) {
  return request(`/release/flow/mergeOrders`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 版体管理员拆分工单/release/flow/splitOrders
export async function splitOrders(params) {
  return request(`/release/flow/splitOrders`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 版本管理员附件清单更新/release/from/releaseAttachBatchEdit
export async function attachBatchEdit(params) {
  return request(`/release/from/releaseAttachBatchEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 版本管理员审核表单保存/release/flow/saveCheckVersion
export async function saveCheckVersion(params) {
  return request(`/release/flow/saveCheckVersion`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 科室负责人审核表单保存/release/flow/saveCheckVersion
export async function saveCheckDirector(params) {
  return request(`/release/flow/saveCheckDirector`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 中心领导审核表单保存/release/flow/saveCheckLeader
export async function saveCheckLeader(params) {
  return request(`/release/flow/saveCheckLeader`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布实施表单保存 /release/flow/savePracticeDone
export async function savePracticeDone(params) {
  return request(`/release/flow/savePracticeDone`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 业务复核 /release/flow/saveBizCheck
export async function saveBizCheck(params) {
  return request(`/release/flow/saveBizCheck`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 清单统计 /release/flow/classifyList
export async function classifyList(taskIds) {
  return request(`/release/from/classifyList?taskIds=${taskIds}`, {
    method: 'GET',
  });
}

// 流程删除 /release/flow/delete?releaseNo=FB202108200009
export async function deleteFlow(params) {
  return request(`/release/flow/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 获取工单历史信息 /release/flow/orderInfo?releaseNo=FB202108230006
export async function orderInfo(releaseNo) {
  return request(`/release/flow/orderInfo?releaseNo=${releaseNo}`, {
    method: 'GET',
  });
}

// 流程图 /release/flow/image?processInstanceId=742501
export async function orderImg(processInstanceId) {
  return request(`/release/flow/image?processInstanceId=${processInstanceId}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 发布查询 /release/flow/image?processInstanceId=742501
export async function searchOrder(params) {
  return request(`/release/from/searchOrder`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布超时管理列表/release/timeout/configList
export async function TimeoutconfigList(params) {
  return request(`/release/timeout/configList`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布超时管理删除
export async function TimeoutdelConfig(params) {
  return request(`/release/timeout/delConfig`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布超时管理新增编辑
export async function TimeoutsaveConfig(params) {
  return request(`/release/timeout/saveConfig`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 回退信息
export async function saveGobackMsg(params) {
  return request(`/common/msg/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 超时接口/release/timeout/getTimeoutInfo?taskId=1245429
export async function getTimeoutInfo(params) {
  return request(`/release/timeout/getTimeoutInfo`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 清单导出
export async function releaseListsDownload(params) {
  return request(`/release/fileProc/exportList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob',
  });
}

// 发布查询导出/release/fileProc/exportReleaseOrder
export async function exportReleaseOrder(params) {
  return request(`/release/fileProc/exportReleaseOrder`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
    responseType: 'blob',
  });
}

// 发布库列表
export async function repoList(params) {
  return request(`/release/repo/list`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 发布库删除
export async function repoDel(params) {
  return request(`/release/repo/del`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布库生成出厂测试
export async function repoRegister(params) {
  return request(`/release/repo/register`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 修改版本号
export async function saveVersion(params) {
  return request(`/release/from/saveVersion`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发起服务绩效 /release/external/releaseToQuality
export async function releaseToQuality(params) {
  return request(`/release/external/releaseToQuality`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布登记获取新的附件列表 /release/from/getBlankAttachList
export async function getBlankAttachList() {
  return request(`/release/from/getBlankAttachList`, {
    method: 'GET',
  });
}

// 附件列表环节导出/release/fileProc/exportTaskToDocx
export async function exportTaskToDocx(params) {
  return request(`/release/fileProc/exportTaskToDocx`, {
    method: 'POST',
    data: params,
    requestType: 'form',
    responseType: 'blob',
  });
}

// 发布工单查最新的清单
export async function getOpenLastList(releaseNo) {
  return request(`/release/from/openLastList?releaseNo=${releaseNo}`, {
    method: 'GET',
  });
}
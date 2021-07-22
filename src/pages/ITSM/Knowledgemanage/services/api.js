import request from '@/utils/request';

// 获取列表信息
export async function queryTodoList(params) {
  return request(`/knowledge/form/getMyKnowledgeList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 新建单
export async function addkowledge() {
  return request(`/knowledge/flow/add`, {
    method: 'GET',
  });
}

// 保存
export async function savekowledge(params) {
  return request(`/knowledge/flow/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 提交
export async function submitkowledge(params) {
  return request(`/knowledge/flow/submit`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 发布
export async function releasekowledge(params) {
  return request(`/knowledge/flow/release`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 撤销发布
export async function revokekowledge(params) {
  return request(`/knowledge/flow/revoke`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 废止
export async function abolishkowledge(params) {
  return request(`/knowledge/flow/abolish`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 删除
export async function deletekowledge(params) {
  return request(`/knowledge/flow/delete`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 打开待办
export async function openkowledge(mainId) {
  return request(`/knowledge/flow/openFlow?mainId=${mainId}`, {
    method: 'GET',
    //  requestType: 'form',
  });
}

// 获取列表信息
export async function queryUpdateList(params) {
  return request(`/knowledge/form/getUpdateList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 知识统计列表
export async function queryStatisList(time1, time2) {
  return request(`/knowledge/statis/getKnowledgeStatisList?time1=${time1}&time2=${time2}`, {
    method: 'GET',
  });
}

// 知识统计导出
export async function downloadStatisExcel(time1, time2) {
  return request(`/knowledge/statis/downloadStatisExcel?time1=${time1}&time2=${time2}`, {
    method: 'GET',
  });
}
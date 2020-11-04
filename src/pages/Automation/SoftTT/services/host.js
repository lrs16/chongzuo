import request from '@/utils/request';

// 请求主机列表
export async function myHosts(params) {
  return request(`/auto/hosts/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 保存主机信息
export async function savaHostInfo(params) {
  return request(`/auto/hosts`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑保存书记信息
export async function editHostInfo(params) {
  return request(`/auto/hosts`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// 删除主机信息
export async function removeHostInfo(id) {
  // const hostid = stringify(id);
  return request(`/auto/hosts/${id}`, {
    method: 'DELETE',
  });
}

//批量添加主机
export async function batchAddhost(params) {
  return request(`/auto/hosts/batchSave`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// // 软件的接口
// 列表和搜索
export async function searchSofts(params) {
  return request(`/auto/softwares/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function querySaveSoft(params) {
  return request(`/auto/softwares/${params.hostId}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryEditSoft(params) {
  return request(`/auto/softwares`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function queryRemoveSoft(id) {
  return request(`/auto/softwares/${id}`, {
    method: 'DELETE',
  });
}

// 进程的接口
// 列表
export async function searchProcess(params) {
  return request(`/auto/courses/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 进程添加
export async function addProcess(params) {
  return request(`/auto/courses`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 进程删除
export async function removeProcess(id) {
  return request(`/auto/courses/${id}`, {
    method: 'DELETE',
  });
}

// // 进程编辑、更新
export async function editeProcess(params) {
  return request(`/auto/courses`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function batchAddprocess(params) {
  return request(`/auto/courses/batchSave`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 请求主机的软件信息， 生成表格 /auto/hostsHandle/tree/{hostsId}/softwares/  mxj
export async function querySoftwaresList(hostId) {
  return request(`/auto/hostsHandle/tree/${hostId}/softwares`, {
    method: 'GET',
  });
}

// 根据树杈点击的主机编号, 获取主机ip和端口 /auto/hosts/{id}根据编号查询信息  mxj
export async function queryToHostList(id) {
  return request(`/auto/hosts/${id}`, {
    method: 'GET',
  });
}

import { stringify } from 'qs';
import request from '@/utils/request';

// 主机信息
export async function savaHostInfo(params) {
  return request(`/api-meter-auto/auto_hosts`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function editHostInfo(params) {
  return request(`/api-meter-auto/auto_hosts`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function removeHostInfo(id) {
  // const hostid = stringify(id);
  return request(`/api-meter-auto/auto_hosts/${id}`, {
    method: 'DELETE',
  });
}

export async function searchHosts(params) {
  return request(`/api-meter-auto/auto_hosts/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 软件的接口
export async function searchSofts(params) {
  return request(`/api-meter-auto/auto_softwares/listPage`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function querySaveSoft(params) {
  return request(`/api-meter-auto/auto_softwares`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryEditSoft(params) {
  return request(`/api-meter-auto/auto_softwares`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function queryRemoveSoft(id) {
  return request(`/api-meter-auto/auto_softwares/${id}`, {
    method: 'DELETE',
  });
}

// 程序执行
export async function querySoftExetute() {
  return request(`/api/softexetuteList`);
}

// 请求进程列表
// export async function queryProcessList() {
//   return request(`/api/processList`);
//   return request(`/api-meter-auto/auto_courses/listPage`, {
//     method: 'post',
//     data: params,
//     requestType: 'form'
//   });
// }

// 进程查询
export async function searchProcess() {
  return request(`/api-meter-auto/auto_courses`, {
    method: 'GET',
    //   body: JSON.stringify(params),
  });
}

// export async function searchProcess(params) {
//   return request(`/api-meter-auto/auto_courses/listPage`, {
//     method: 'POST',
//     data: params,
//     requestType: 'form',
//   });
// }

// 进程添加
export async function addProcess(params) {
  return request('/api-meter-auto/auto_courses', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 进程删除
export async function removeProcess(id) {
  return request(`/api-meter-auto/auto_courses/${id}`, {
    method: 'DELETE',
  });
}

// 进程编辑、更新
export async function editeProcess(params) {
  return request(`/api-meter-auto/auto_courses`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

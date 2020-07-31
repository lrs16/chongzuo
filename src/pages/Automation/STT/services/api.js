import { stringify } from 'qs';
import request from '@/utils/request';

//主机的基本信息
export async function queryHostList() {
  return request(`/api/hostList`, {});
}

export async function savaHostInfo(params) {
  return request(`/api/savaDate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function editHostInfo(params) {
  return request(`/api/saveEdit`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function removeHostInfo(id) {
  const hostid = stringify(id);
  return request(`/api/removeHost/${hostid.replace(/id=/, '')}`, {
    method: 'DELETE',
    data: id,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestType: 'form',
  });
}

//软件的接口
export async function querySoftList() {
  return request(`/api/softList`, {});
}

export async function querySaveSoft(params) {
  return request(`/api/savaDate`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryEditSoft(params) {
  return request(`/api/softEdit`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryRemoveSoft(id) {
  const softid = stringify(id);
  return request(`/api/removeHost/${softid.replace(/id=/, '')}`, {
    method: 'DELETE',
    data: id,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestType: 'form',
  });
}

//进程的列表
export async function queryProcessList() {
  return request(`/api/processList`, {});
}

export async function queryProcessEdit(params) {
  return request(`/api/processEdit`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryProcessSave(params) {
  return request(`/api/processSave`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function processRemove(id) {
  const processid = stringify(id);
  return request(`/api/processRemove/${processid.replace(/id=/, '')}`, {
    method: 'DELETE',
    data: id,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestType: 'form',
  });
}

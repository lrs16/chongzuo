import { stringify } from 'qs';
import request from '@/utils/request';

//主机的基本信息
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
    data: params,
    requestType: 'form',
  });
}

//软件的接口
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

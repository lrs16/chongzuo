import { stringify } from 'qs';
import request from '@/utils/request';
// 请求脚本MOCK列表
export async function queryScripts(params) {
  return request(`/api/script?${stringify(params)}`);
}
// export async function queryScripts(pageNumber, pageSize,params){
//   console.log(pageNumber, pageSize);
//   return request(`/dveopsapi/scriptList` , {
//     method:'POST',
//     body:JSON.stringify(params),
// });
// }
// 请求资源列表
export async function queryResources(params) {
  return request(`/api/resouresList?${stringify(params)}`);
}

// 请求脚本例表

export async function queryScriptlist(limit, pages) {
  return request(`/api-eai-job/oma/jobInfo/list?limit=${limit}&pages=${pages}`, {
    method: 'POST',
  });
}

// 请求脚本详情
export async function queryScriptinfo(id) {
  return request(`/api-eai-job/oma/jobInfo/${id}`, {
    method: 'GET',
  });
}

// 添加脚本
export async function AddScript(params) {
  // console.log(params);
  return request('/api/script', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 编辑脚本
export async function editScript(id, params) {
  // console.log( id, params );
  return request(`/api/script?${id}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除脚本
export async function removeScript(id) {
  // console.log( id);
  return request(`/api/script?${id}`, {
    method: 'DELETE',
  });
}

// 请求编排历史
export async function queryJobs() {
  return request(`/api/jobs`);
}

// 请求作业历史
export async function queryWorks() {
  return request(`/api/jobs`);
}
// 快速执行作业
export async function DoJobs(id, params) {
  // console.log( id, params );
  return request(`/api/addjob?${id}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 请求作业详情
export async function queryBasicJobs(id) {
  return request(`/api/jobs/basic?id=${id}`);
}
// export async function AddScript(params) {
//   const { count = 10, ...restParams } = params;
//   return request(`/api/script?count=${count}`, {
//     method: 'POST',
//     data: {
//       ...restParams,
//       method: 'post',
//     },
//   });
// }

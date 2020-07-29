import { stringify } from 'qs';
import request from '@/utils/request';

// 运维场景：请求列表MOCK
// export async function querySeceneList(params) {
//   return request(`/api/fake_list?${stringify(params)}`);
// }
export async function querySeceneList(limit, pages) {
  return request(`/api-eai-job/oma/scenario/list?limit=${limit}&pages=${pages}`, {
    method: 'POST',
  });
}

// 运维场景：删除
export async function removeSeceneList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}
// 运维场景：增加
export async function addSeceneList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

// 运维场景：编辑
export async function updateSeceneList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
// 请求报告 ,第一步请求场景中的脚本，第二步根据脚本获取报告
export async function querySeceneScript(id) {
  return request(`/api-eai-job/oma/scenario/layout/${id}`, {
    method: 'POST',
  });
}

export async function queryReport(jobId) {
  return request(`/api-eai-jobdownload/${jobId}/new`);
}

// 运维场景脚本执行历史
export async function querySecenejoblist(jobId) {
  return request(`/api-eai-job/oma/job/history/${jobId}`);
}
// 运维场景执行
export async function execuSecene(scenarioId) {
  return request(`/api-eai-job/oma/scenario/execute/${scenarioId}`);
}

// 预览文档
export async function View(jobid) {
  return request(`/api-eai-job/oma/view/${jobid}/specify`, {
    method: 'GET', // GET / POST 均可以
    // data: jobid,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

// 下载文档
export async function Download(jobid) {
  return request(`/api-eai-job/oma/download/${jobid}/specify`, {
    method: 'GET', // GET / POST 均可以
    // data: jobid,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

export async function NewDownload(jobid) {
  // console.log(jobid);
  return request(`/api-eai-job/oma/download/${jobid}/new`, {
    method: 'GET', // GET / POST 均可以
    // data: jobid,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

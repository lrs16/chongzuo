import request from '@/utils/request';
// 软件
export async function searchSofts(params) {
  return request(`/auto/softwares/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function rightShuttlebox(hostId) {
  return request(`/auto/hosts/getSoftwaresByHostId/${hostId}`);
}

export async function updatehostrole(hostId,sofvalue) {
  return request(`/auto/hosts/${hostId}/softwareIds`,{
    method:'POST',
    body: JSON.stringify(sofvalue),
  });
}
// 软件
export async function softleftShuttle(params) {
  return request(`/auto/courses/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function softrightShuttle(softId) {
  return request(`/auto/softwares/getCoursesBySoftId/${softId}`);
}

export async function updatesoftrole(softwareId,coursevalue) {
  return request(`/auto/softwares/${softwareId}/courseIds`,{
    method:'POST',
    body: JSON.stringify(coursevalue)
  })
}

// 进程的接口
// 列表
export async function searchProcess(params) {
  return request(`/auto/courses/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 请求主机列表
export async function myHosts(params) {
  console.log('ik');
  return request(`/auto/hosts/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

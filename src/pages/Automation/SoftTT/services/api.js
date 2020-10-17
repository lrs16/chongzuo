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

export async function updatehostrole(hostId, sofvalue) {
  return request(`/auto/hosts/${hostId}/softwareIds`, {
    method: 'POST',
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

export async function updatesoftrole(softwareId, coursevalue) {
  return request(`/auto/softwares/${softwareId}/courseIds`, {
    method: 'POST',
    body: JSON.stringify(coursevalue),
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

// 请求主机列表
export async function myHosts(params) {
  console.log('ik');
  return request(`/auto/hosts/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//mxj
// 程序执行
export async function querySoftExetute() {
  return request(`/api/softexetuteList`);
}

// /auto/hosts_shh2/encrypt/{encryptStr} 加密数据
export async function queryHostEncryptStr(encryptStr) {
  return request(`/auto/hosts_shh2/encrypt/${encryptStr}`, {
    method: 'GET',
  });
}

// 软件启停-主机_SSH2管理 /auto/hosts_shh2新建消息
export async function queryHostShh2(params) {
  return request(`/auto/hosts_shh2`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 软件启停-主机_SSH2管理 /auto/hosts_shh2查询消息
export async function queryHostShh2Search(params) {
  return request(`/auto/hosts_shh2/getByUserNameAndIp`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 软件启停-主机_SSH2管理 /auto/hosts_shh2/execCommand 执行ssh命令
export async function queryHostShh2ExecCommand(params) {
  return request(`/auto/hosts_shh2/execCommand`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 软件启停-主机_SSH2管理 主机列表数据
export async function queryHostShh2List(params) {
  return request(`/auto/hosts/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 软件列表数据
export async function querySearchSofts(params) {
  return request(`/auto/softwares/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 软件启停-主机_SSH2 执行日志--表格
export async function queryExecLog(params) {
  return request(`/auto/exec_log/listPage/${params.ip}`, {
    method: 'POST',
    data: params,
  });
}
// 软件启停-主机_SSH2 执行日志详情
export async function queryExecLogDetail(id) {
  return request(`/auto/exec_log/${id}`, {
    method: 'GET',
  });
}

// 请求主机的软件信息， 生成表格 /auto/hosts_shh2/tree/{hostsId}/softwares/  mxj
export async function querySoftwaresList(hostId) {
  return request(`/auto/hosts_shh2/tree/${hostId}/softwares`, {
    method: 'GET',
  });
}

// 根据树杈点击的主机编号, 获取主机ip和端口 /auto/hosts/{id}根据编号查询信息  mxj
export async function queryToHostList(id) {
  return request(`/auto/hosts/${id}`, {
    method: 'GET',
  });
}

// 请求主机， 生成结构树 /auto/hosts_shh2/tree/hosts/  mxj
export async function queryHostTree(params) {
  return request(`/auto/hosts_shh2/tree/hosts/`, {
    method: 'GET',
    body: JSON.stringify(params),
  });
}

// /auto/hosts_shh2/handle/{hostsId}/{softId}/{handleType}操作主机的软件信息
export async function querySofttoHostHandleType({hostsId, softId, handleType}) {
  return request(`/auto/hosts_shh2/handle/${hostsId}/${softId}/${handleType}`, {
    method: 'GET',
  });
}

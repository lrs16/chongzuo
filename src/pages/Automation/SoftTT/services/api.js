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

// /auto/hostsHandle/encrypt/{encryptStr} 加密数据
export async function queryHostEncryptStr(encryptStr) {
  return request(`/auto/hostsHandle/encrypt/${encryptStr}`, {
    method: 'GET',
  });
}

// 软件启停-主机_SSH2管理 /auto/hostsHandle新建消息
export async function queryHostShh2(params) {
  return request(`/auto/hostsHandle`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 软件启停-主机_SSH2管理 /auto/hostsHandle查询消息
export async function queryHostShh2Search(params) {
  return request(`/auto/hostsHandle/getByUserNameAndIp`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 软件启停-主机_SSH2管理 /auto/hostsHandle/execCommand 执行ssh命令
export async function queryHostShh2ExecCommand(params) {
  return request(`/auto/hostsHandle/execCommand`, {
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
  return request(`/auto/hostsHandleLog/listPage/${params.ip}`, {
    method: 'POST',
    data: params,
  });
}
// 软件启停-主机_SSH2 执行日志详情
export async function queryExecLogDetail(id) {
  return request(`/auto/hostsHandleLog/${id}`, {
    method: 'GET',
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

// 请求主机， 生成结构树 /auto/hostsHandle/tree/hosts/  mxj
export async function queryHostTree(params) {
  return request(`/auto/hostsHandle/tree/hosts/`, {
    method: 'GET',
    body: JSON.stringify(params),
  });
}

// /auto/hostsHandle/handle/{hostsId}/{softId}/{handleType}操作主机的软件信息
export async function querySofttoHostHandleType({ hostsId, softId, handleType }) {
  return request(`/auto/hostsHandle/handle/${hostsId}/${softId}/${handleType}`, {
    method: 'GET',
  });
}

// /auto/hostsHandle/listPage/{hostsIp} 获取SSH信息表格数据
export async function querySshInfoList(params) {
  return request(`/auto/hostsHandle/listPage/${params.hostIp}`, {
    method: 'POST',
    data: params,
  });
}

// /auto/hostsHandle/{id} 根据编号查询信息 编辑功能
export async function searchSshInfotoEdit(id) {
  return request(`/auto/hostsHandle/${id}`, {
    method: 'GET',
  });
}

// /auto/hostsHandle SSH信息表格数据编辑
export async function editeSshInfoList(params) {
  return request(`/auto/hostsHandle`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

// /auto/hostsHandle SSH信息表格数据添加
export async function addSshInfoList(params) {
  return request(`/auto/hostsHandle`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// /auto/hostsHandle SSH信息表格数据删除
export async function removeSshInfoList(id) {
  return request(`/auto/hostsHandle/${id}`, {
    method: 'DELETE',
  });
}

// /auto/hostsHandle/{id}/checkSshLink 检测SSH帐号连接情况
export async function queryCheckSshLink(id) {
  return request(`/auto/hostsHandle/${id}/checkSshLink`, {
    method: 'GET',
  });
}

// /auto/hostsHandle/{id}/secretThief 查看密码信息 - 暂时管理员可查看
export async function querySecretThief(id) {
  return request(`/auto/hostsHandle/${id}/secretThief`, {
    method: 'GET',
  });
}

//命令配置列表和搜索
export async function configList(params){
  return request(`/auto/commandConfig/listPage`,{
    method: 'POST',
    body: JSON.stringify(params),
  });
}
//保存接口
export async function saveCommandlist(params) {
  return request(`/auto/commandConfig`,{
    method:'POST',
    body:JSON.stringify(params),
  });
}
// 更新配置信息
export async function updateCommand(values) {
  return request(`/auto/commandConfig`,{
    method:'PUT',
    body:JSON.stringify(values),
  });
}
//删除配置信息
export async function deleteCommand(id){
  return request(`/auto/commandConfig/${id}`,{
    method:'DELETE'
  });
}
//编辑通过id查找
export async function editSearchinfo(id){
  return request(`/auto/commandConfig/${id}`);
}
// /auto/hostsHandle/cascade/info/{hostIp} 级联-主机Ip用户名端口命令等下拉列表
export async function queryCascadeInfo(hostIp) {
  return request(`/auto/hostsHandle/cascade/info/${hostIp}`, {
    method: 'GET',
  });
}

// 请求命令树形信息 /auto/commandConfig/tree/command/  mxj
export async function queryComConfigTree(params) {
  return request(`/auto/commandConfig/tree/command/`, {
    method: 'GET',
    body: JSON.stringify(params),
  });
}

import request from '@/utils/request';
// 软件
export async function AgentList(params, pageNum, pageSize) {
  return request(`/lasting/agent/config/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 更新agent数据 /lasting/agent/config
export async function updataAgent(params) {
  return request(`/lasting/agent/config`, {
    method: 'PUT',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// ****设备管理
// 获取设备列表 /assets/host/listPage/{pageNum}/{pageSize}
export async function EquipList(params, pageNum, pageSize) {
  return request(`/assets/host/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 设备-新增/编辑
export async function updateEquip(params) {
  return request(`/assets/host/addOrEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 设备-删除
export async function deleteEquip(id) {
  return request(`/assets/host/deleteHost`, {
    method: 'DELETE',
    data: id,
    requestType: 'form',
  })
}

// 设备-导出
export async function EquipqueryExport(params) {
  return request(`/assets/host/downloadHostExcel`, {
    method: 'POST',
    responseType: 'blob',
    body: JSON.stringify(params),
  });
}

// 设备-下载导入模板
export async function downloadEquipTemplate() {
  return request(`/assets/host/downloadTemplate`, {
    method: 'POST',
    responseType: 'blob'
  });
}

// ****机柜管理 
// 获取机柜列表
export async function CabinetList(params, pageNum, pageSize) {
  return request(`/assets/cabinet/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 机柜-新增/编辑
export async function updateCabinet(params) {
  return request(`/assets/cabinet/addOrEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
    // requestType: 'formjosn',
  });
}

// 机柜-删除
export async function deleteCabinet(cabinetIds) {
  return request(`/assets/cabinet/deleteCabinet`, {
    method: 'DELETE',
    data: cabinetIds,
    requestType: 'form',
  })
}

// /assets/cabinet/getCabinetMsg 根据区域编号获取机柜信息
export async function getCabinetMsg(params) {
  return request(`/assets/cabinet/getCabinetMsg`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// ****软件管理
// /assets/host/findCascade 查询区域；查询主机名称；查询主机IP
export async function getfindCascade(params) {
  return request(`/assets/host/findCascade`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}
// 获取软件列表
export async function SoftList(params, pageNum, pageSize) {
  return request(`/assets/soft/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 软件-新增
export async function addSoft(params) {
  return request(`/assets/soft/addSoft`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 软件-编辑
export async function editSoft(params) {
  return request(`/assets/soft/editSoft`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 软件-删除
export async function deleteSoft(softIds) {
  return request(`/assets/soft/deleteSoft`, {
    method: 'DELETE',
    data: softIds,
    requestType: 'form',
  })
}

// 软件属性管理
// 新增或编辑
export async function dynamicaddOrEdit(params) {
  return request(`/assets/dynamic/addOrEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 删除数据,只支持单条删除
export async function deleteDynamic(Ids) {
  return request(`/assets/dynamic/deleteDynamic`, {
    method: 'DELETE',
    data: Ids,
    requestType: 'form',
  })
}

// 获取软件下的所有属性配置
export async function findDynamic(softId, pageNum, pageSize) {
  return request(`/assets/dynamic/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: { pageNum, pageSize, softId },
    body: JSON.stringify(softId),
  });
}

// ****脚本配置
// 获取脚本配置系统脚本列表
export async function systemScriptList(params, pageNum, pageSize) {
  return request(`/assets/script/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 添加、编辑
export async function systemscriptaddOrEdit(params) {
  return request(`/assets/script/addOrEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 删除系统脚本列表数据
export async function deletesystemScript(dynamicIds) {
  return request(`/assets/script/deleteScript`, {
    method: 'DELETE',
    data: dynamicIds,
    requestType: 'form',
  })
}

// 撤回--系统脚本
export async function recellScript(Ids) {
  return request(`/assets/script/recellScript`, {
    method: 'POST',
    data: {Ids},
    // body: JSON.stringify(Ids),
  })
}

// 获取本地脚本list列表 /assets/localScript/listPage/{pageNum}/{pageSize}
export async function localScriptList(params, pageNum, pageSize) {
  return request(`/assets/localScript/listPage/${pageNum}/${pageSize}`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 本地脚本添加 /assets/localScript/add
export async function localscriptadd(params) {
  return request(`/assets/localScript/add`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 本地脚本编辑v/assets/localScript/edit
export async function localscriptedit(params) {
  return request(`/assets/localScript/edit`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 本地脚本删除 /assets/localScript/deleteScript
export async function deletelocalScript(Ids) {
  return request(`/assets/localScript/deleteScript`, {
    method: 'DELETE',
    data: Ids,
    requestType: 'form',
  })
}
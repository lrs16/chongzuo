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
// 获取设备列表
export async function EquipList(params) {
  return request(`/asset/host/findHostList`, {
    method: 'POST',
    data: params,
    requestType: 'form'
  });
}

// 设备-新增/编辑
export async function updateEquip(params) {
  return request(`/asset/host/addOrEdit`, {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

// 设备-删除
export async function deleteEquip(id) {
  return request(`/assets/cabinet/deleteCabinet`, {
    method: 'DELETE',
    data: id,
    requestType: 'form',
  })
}


// ****机柜管理 
// 获取机柜列表
export async function CabinetList(params) {
  return request(`/assets/cabinet/findCabinetList`, {
    method: 'POST',
    data: params,
    requestType: 'form'
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
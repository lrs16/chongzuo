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


// ****机柜管理 
// 获取机柜列表
export async function CabinetList(params, pageNum, pageSize) {
  return request(`/assets/cabinet/findCabinetList/${pageNum}/${pageSize}`, {
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
    requestType: 'formjosn',
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
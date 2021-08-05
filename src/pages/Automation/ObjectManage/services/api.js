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
import request from '@/utils/request';

export async function queryfaultTodoList() { // 故障待办列表
    return request('/api/FaultTodoList');
}

export async function queryfaultSearchList() { // 故障待办列表
    return request('/api/FaultSearchList');
}

// 故障明细表
export async function queryFaultDetailList(params) {
    return request(`/api/fault/faultdetailList`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
  



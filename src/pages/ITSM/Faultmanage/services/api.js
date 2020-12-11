import request from '@/utils/request';

export async function queryfaultTodoList(params) { // 故障待办列表
    return request('/api/fault/faulttodolist', {
      method: 'POST',
      body: JSON.stringify(params),
    });
}

export async function queryfaultSearchList(params) { // 故障查询列表
    return request('/api/fault/faultsearchlist', {
      method: 'POST',
      body: JSON.stringify(params),
    });
}

// 故障明细表
export async function queryFaultDetailList(params) {
    return request(`/api/fault/faultdetailList`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }



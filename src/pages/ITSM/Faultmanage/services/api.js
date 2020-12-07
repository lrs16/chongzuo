import request from '@/utils/request';

export async function queryfaultTodoList() { // 故障待办列表
    return request('/api/FaultTodoList');
}

export async function queryfaultSearchList() { // 故障待办列表
    return request('/api/FaultSearchList');
}



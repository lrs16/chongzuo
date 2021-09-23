import request from '@/utils/request';

// 根据查询条件显示作业对象数据 空--agent数据
export async function taskObjectList(params, pageNum, pageSize, taskId) {
    return request(`/auto/task/listPageTaskObject/${pageNum}/${pageSize}/${taskId}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
}
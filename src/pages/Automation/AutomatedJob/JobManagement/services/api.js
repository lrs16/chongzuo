import request from '@/utils/request';

// ****作业配置
// 作业配置list
export async function autotaskList(params, pageNum, pageSize) {
    return request(`/auto/task/listPage/${pageNum}/${pageSize}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 根据查询条件显示作业对象数据 空--agent数据
export async function taskObjectList(params, pageNum, pageSize, taskId) {
    return request(`/auto/task/listPageTaskObject/${pageNum}/${pageSize}/${taskId}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 根据查询条件显示脚本数据 空--全部数据
export async function taskScriptList(params, pageNum, pageSize, taskId) {
    return request(`/auto/task/listPageTaskScript/${pageNum}/${pageSize}/${taskId}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 增加数据
export async function addTask(params) {
    return request(`/auto/task`, {
        method: 'POST',
        data: JSON.stringify(params),
    });
}

// 更新数据
export async function editTask(params) {
    return request(`/auto/task`, {
        method: 'PUT',
        data: JSON.stringify(params),
    });
}

// 删除数据
export async function deleteTask(taskId) {
    return request(`/auto/task/${taskId}`, {
        method: 'DELETE',
    })
}

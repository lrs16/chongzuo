import request from '@/utils/request';

// 根据查询条件显示作业对象数据 空--agent数据
export async function taskObjectList(params, pageNum, pageSize, taskId) {
    return request(`/auto/task/listPageTaskObject/${pageNum}/${pageSize}/${taskId}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

// ***************主机巡检
// 主机巡检列表 /inspection/host/list
export async function inspectionhostList(pageIndex, pageSize) {
    return request(`/inspect/host/list?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

// 时钟巡检列表 /inspection/clock/list
export async function inspectionclockList(pageIndex, pageSize) {
    return request(`/inspect/clock/list?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

// 软件巡检列表 /inspection/soft/list
export async function inspectionsoftList(pageIndex, pageSize) {
    return request(`/inspect/soft/list?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}
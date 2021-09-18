import request from '@/utils/request';

// ****作业配置
// 作业配置list
export async function autotaskList(params, pageNum, pageSize) {
    return request(`/auto/task/listPageAutoTask/${pageNum}/${pageSize}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 根据查询条件显示作业对象数据 空--agent数据
export async function taskObjectList(params, pageNum, pageSize, taskId) {
    return request(`/auto/task/listPageTaskObject/${pageNum}/${pageSize}/${taskId}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

// 根据查询条件显示脚本数据 空--全部数据
export async function taskScriptList(params, pageNum, pageSize, taskId) {
    return request(`/auto/task/listPageTaskScript/${pageNum}/${pageSize}/${taskId}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

// 获得用户已选择的对象数据(agent与脚本) /auto/task/getUseTaskObject/{taskId}
export async function getUseTaskObjectandAgent(taskId) {
    return request(`/auto/task/getUseTaskObject/${taskId}`, {
        method: 'GET',
    });
}

// 新增
export async function addTask(params) {
    return request(`/auto/task/addAutoTask`, {
        method: 'POST',
        data: JSON.stringify(params),
    });
}

// /auto/task/getAutoTaskById/{taskId} 编辑获得作业方案数据
export async function getAutoTaskById(taskId) {
    return request(`/auto/task/getAutoTaskById/${taskId}`, {
        method: 'GET',
        //   data: { taskId },
    });
}

// 编辑
export async function editTask(params) {
    return request(`/auto/task/updAutoTask`, {
        method: 'PUT',
        data: JSON.stringify(params),
    });
}

// 提交 /auto/task/updAutoTaskStatus/{taskId}/{taskStatus} 更新作业方案状态(审批)
export async function submitTask(params) {
    return request(`/auto/task/updAutoTaskStatus/${params.taskId}/${params.taskStatus}`, {
        method: 'GET',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 删除数据
export async function deleteTask(taskId) {
    return request(`/auto/task/delAutoTask/${taskId}`, {
        method: 'DELETE',
        data: { taskId },
    })
}

// /auto/task/examineTask 审批作业方案 接口增加记录
export async function addExamineTask(params) {
    return request(`/auto/task/addExamineTask`, {
        method: 'POST',
        data: JSON.stringify(params),
    });
}

// 接口更新记录
export async function updExamineTask(params) {
    return request(`/auto/task/updExamineTask`, {
        method: 'PUT',
        data: JSON.stringify(params),
    });
}

// 审批作业方案历史表
export async function getexamineTaskList(taskId) {
    return request(`/auto/task/examineTaskList/${taskId}`, {
        method: 'GET',
        //   data: { taskId },
    });
}

// 运行作业脚本 /auto/task/runTask/{taskId}
export async function queryrunTask(taskId) {
    return request(`/auto/task/runTask/${taskId}`, {
        method: 'GET',
    });
}

// /auto/task/updAutoTaskQrtzJobStatus/{taskId}/{qrtzJobStatus}
// 启动或暂停作业方案(定时任务使用)(状态 1启动 0暂停)
export async function queryUpdAutoTaskQrtzJobStatus(params) {
    return request(`/auto/task/updAutoTaskQrtzJobStatus/${params.taskId}/${params.qrtzJobStatus}`, {
        method: 'GET',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// http://172.16.10.33:9901/auto/task/listPageAutoTaskLogs/1/15 执行日志
export async function querylistPageAutoTaskLogs(params, pageNum, pageSize) {
    return request(`/auto/task/listPageAutoTaskLogs/${pageNum}/${pageSize}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// /auto/task/logicDelTask/{taskId} 作废作业方案(逻辑删除,作业状态变为 6.已作废 )
export async function logicDelTask(taskId) {
    return request(`/auto/task/logicDelTask/${taskId}`, {
        method: 'GET',
    });
}
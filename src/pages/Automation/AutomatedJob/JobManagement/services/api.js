import request from '@/utils/request';

// ****作业配置
// 作业配置list
export async function autotaskList(params, pageNum, pageSize) {
    return request(`/auto/target/listPageAutoTask/${pageNum}/${pageSize}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// // 根据查询条件显示作业对象数据 空--agent数据
// export async function taskObjectList(params, pageNum, pageSize) {
//     return request(`/auto/target/listPageTaskObject/${pageNum}/${pageSize}`, {
//         method: 'POST',
//         data: { params, pageNum, pageSize },
//     });
// }

// // 根据查询条件显示脚本数据 空--全部数据
// export async function taskScriptList(params, pageNum, pageSize) {
//     return request(`/auto/target/listPageTaskScript/${pageNum}/${pageSize}`, {
//         method: 'POST',
//         data: { params, pageNum, pageSize },
//     });
// }

// 根据查询条件显示作业对象数据 空--agent数据
export async function taskObjectList(params, pageNum, pageSize) {
    return request(`/auto/target/listPageTaskObject/${pageNum}/${pageSize}/${params.id}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 根据查询条件显示脚本数据 空--全部数据
export async function taskScriptList(params, pageNum, pageSize) {
    return request(`/auto/target/listPageTaskScript/${pageNum}/${pageSize}/${params.id}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 获得用户已选择的对象数据(agent与脚本) /auto/target/getUseTaskObject/{taskId}
export async function getUseTaskObjectandAgent(taskId) {
    return request(`/auto/target/getUseTaskObject/${taskId}`, {
        method: 'GET',
    });
}

// 新增
export async function addTask(params) {
    return request(`/auto/target/addAutoTask`, {
        method: 'POST',
        data: JSON.stringify(params),
    });
}

// /auto/target/getAutoTaskById/{taskId} 编辑获得作业方案数据
export async function getAutoTaskById(taskId) {
    return request(`/auto/target/getAutoTaskById/${taskId}`, {
        method: 'GET',
        //   data: { taskId },
    });
}

// 编辑
export async function editTask(params) {
    return request(`/auto/target/updAutoTask`, {
        method: 'PUT',
        data: JSON.stringify(params),
    });
}

// 提交 /auto/target/updAutoTaskStatus/{taskId}/{taskStatus} 更新作业方案状态(审批)
export async function submitTask(params) {
    return request(`/auto/target/updAutoTaskStatus/${params.taskId}/${params.taskStatus}`, {
        method: 'GET',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// 删除数据
export async function deleteTask(taskId) {
    return request(`/auto/target/delAutoTask/${taskId}`, {
        method: 'DELETE',
        data: { taskId },
    })
}

// /auto/target/examineTask 审批作业方案 接口增加记录
export async function addExamineTask(params) {
    return request(`/auto/target/addExamineTask`, {
        method: 'POST',
        data: JSON.stringify(params),
    });
}

// 接口更新记录
export async function updExamineTask(params) {
    return request(`/auto/target/updExamineTask`, {
        method: 'PUT',
        data: JSON.stringify(params),
    });
}

// 审批作业方案历史表
export async function getexamineTaskList(taskId) {
    return request(`/auto/target/examineTaskList/${taskId}`, {
        method: 'GET',
        //   data: { taskId },
    });
}
import request from '@/utils/request';

// 启停登记页面分页查询 /auto/soft/listPageAutoSoftWord/{pageNum}/{pageSize} - 分页查询数据
export async function listPageAutoSoftWord(params, pageNum, pageSize) {
    return request(`/auto/soft/listPageAutoSoftWord/${pageNum}/${pageSize}`, {
        method: 'POST',
        data: JSON.stringify(params),
        requestType: 'formjosn',
    });
}

// /auto/soft/listPageSoftObject/{pageNum}/{pageSize}/{workId} 分页查询 - 软件对象数据(如果为空则显示全部软件数据)
export async function autoSoftObjectList(params, pageNum, pageSize, workId) {
    return request(`/auto/soft/listPageSoftObject/${pageNum}/${pageSize}/${workId}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

// 添加软件启停方案数据
export async function addAutoSoftWork(autoSoftWork, autoSoftWorkExamine) {
    return request(`/auto/soft/addAutoSoftWork`, {
        method: 'POST',
        data: {autoSoftWork, autoSoftWorkExamine},
    });
}

// /auto/soft/getAutoSoftWorkDtoById/{workId} 编辑获得作业方案数据
export async function getAutoSoftWorkDtoById(workId) {
    return request(`/auto/soft/getAutoSoftWorkDtoById/${workId}`, {
        method: 'GET',
    });
}

// 编辑
export async function editAutoSoftWork(params) {
    return request(`/auto/soft/updAutoSoftWork`, {
        method: 'PUT',
        data: JSON.stringify(params),
    });
}

// 提交 /auto/soft/updAutoWorkStatus/{workId}/{workStatus} 更新启停工单的状态(提交/审批)
export async function submitAutoSoftWork(params, autoSoftWork, autoSoftWorkExamine) {
    return request(`/auto/soft/updAutoWorkStatus/${params.workId}/${params.workStatus}`, {
        method: 'GET',
        data: {autoSoftWork, autoSoftWorkExamine},
        requestType: 'formjosn',
    });
}
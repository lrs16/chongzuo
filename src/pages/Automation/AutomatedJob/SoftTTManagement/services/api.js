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
export async function addAutoSoftWork(params, autoSoftWork, autoSoftWorkExamine) {
    return request(`/auto/soft/addAutoSoftWork`, {
        method: 'POST',
        data: {params, autoSoftWork, autoSoftWorkExamine},
    });
}
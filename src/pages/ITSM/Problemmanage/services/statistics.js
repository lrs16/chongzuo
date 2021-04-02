import request from '@/utils/request';

//  状态列表
export async function statusList(params) {
  return request(`/problem/stat/statOrderByCurrentNodeAndStatus`,{
    method: 'POST',
    body:JSON.stringify(params)
  });
}

//  导出状态列表
export async function statusDownload(params) {
  return request(`/problem/stat/expStatOrderByStatus`,{
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  })
}

// 问题分类统计
export async function classList(params) {
  return request(`/problem/stat/statOrderRelateDict`,{
    method: 'POST',
    body:JSON.stringify(params)
  });
}

//  导出问题分类统计
export async function classDownload(params) {
  return request(`/problem/stat/expStatOrderRelateDict`,{
    method:'POST',
    body:JSON.stringify(params),
    responseType:'blob',
  })
}

//  问题解决管控表
export async function handleGrate(params) {
  return request(`/problem/stat/statOrderByHandleProgress`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  导出问题处理率
export async function handlegrateDownload(params) {
  return request(`/problem/stat/expStatOrderByHandled`,{
    method:'POST',
    body:JSON.stringify(params),
    responseType:'blob'
  })
}

//  超时统计列表
export async function timeoutList(params) {
  return request(`/problem/stat/statOrderByOverTime`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  超时统计的导出
export async function timeoutDownload(params) {
  return request(`/problem/stat/expStatOrderByTime`,{
    method: 'POST',
    body:JSON.stringify(params),
    responseType:'blob'
    
  })
}

//  导出问题工单解决进度管控统计结果
export async function solvescheduleDownload(params) {
  return request(`/problem/stat/expStatOrderByHandleProgress`,{
    method: 'POST',
    body:JSON.stringify(params),
    responseType:'blob'
    
  })
}
import request from '@/utils/request';

//  状态列表
export async function statusList(params) {
  return request(`/problem/stat/statOrderByStatus`,{
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
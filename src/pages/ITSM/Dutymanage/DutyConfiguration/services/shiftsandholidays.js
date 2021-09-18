import request from '@/utils/request';


//  保存班次
export async function shiftSave(params) {
  return request(`/duty/shift/save`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  班次列表
export async function shiftSearch(params) {
  return request(`/duty/shift/search`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  删除班次
export async function shiftDel(ids) {
  return request(`/duty/shift/del`,{
    method:'POST',
    data:{ids},
    requestType:'form'
  })
}


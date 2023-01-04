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

//  添加节假日
export async function holidaySave(params) {
  return request(`/duty/holiday/save`,{
    method:'POST',
    body:JSON.stringify(params),
  })
}

//  节假日列表
export async function holidaySearch(params) {
  return request(`/duty/holiday/search`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  删除班次
export async function holidayDel(id) {
  return request(`/duty/holiday/del`,{
    method:'POST',
    data:{id},
    requestType:'form'
  })
}


//  班次详情

export async function holidayId(id) {
  return request(`/duty/holiday/${id}`)
}

//  启动方案
export async function holidayStart(id) {
  return request(`/duty/holiday/start?id=${id}`)
}

//  查看班次信息
export async function scheduleId(id) {
  return request(`/duty/schedule/${id}`)
}

//  排版设置新增
export async function staffAdd(params) {
  return request(`/duty/schedule/add`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  排版设置新增
export async function staffUpdata(params) {
  return request(`/duty/schedule/upd`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}









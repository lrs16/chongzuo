import request from '@/utils/request';

//  值班人员保存
export async function staffSave(params) {
  return request(`/duty/staff/save`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

//  值班人员列表
export async function staffSearch(params) {
  return request(`/duty/staff/search`, {
    method: 'POST',
    data: params,
    requestType:'form'
  });
}

// 删除值班
export async function staffDel(id) {
  return request(`/duty/staff/del`, {
    method: 'POST',
    data:{id},
    requestType:'form'
  });
}

// 节假日详情
export async function holidayId(id) {
  return request(`/duty/holiday/${id}`)
}

//  排版设置新增
export async function staffAdd(params) {
  return request(`/duty/schedule/add`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  排班表格列表
export async function tableGroupId(params) {
  return request(`/duty/schedule/table/${sessionStorage.getItem('groupId')}?year=${params.year}&month=${params.month}`)
}

// //  排班表格列表
export async function scheduleId(id) {
  return request(`/duty/schedule/${id}`)
}

//  排版设置新增
export async function staffUpdata(params) {
  return request(`/duty/schedule/upd`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  删除月排班
export async function delmonth(params) {
  return request(`/duty/schedule/delmonth`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  删除日
export async function delId(params) {
  return request(`/duty/schedule/del`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}






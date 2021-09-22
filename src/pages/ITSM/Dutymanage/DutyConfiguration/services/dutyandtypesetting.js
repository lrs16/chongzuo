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



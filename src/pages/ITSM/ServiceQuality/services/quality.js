import request from '@/utils/request';

export async function maintenanceList () {
  return request(`/api/quality/maintenanceList`)
}

export async function tobeDealtdata () {
  return request(`/api/quality/tobeDealtdata`)
}

//  新增合同
export async function contractAdd(params) {
  return request(`/quality/contract/add`,{
    method:'POST',
    body:JSON.stringify(params),
    // requestType:'form'
  })
}

//  新增服务商
export async function providerAdd(params) {
  return request(`/quality/provider/add`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  根据服务商ID查询服务商数据
export async function searchProvider(id) {
  return request(`/quality/provider/${id}`)
}

//  根据服务商ID查询合同数据
export async function contractProvider(id) {
  return request(`/quality/contract/provider/${id}`)
}

//  更新合同
export async function contractUpd(params) {
  return request(`/quality/contract/upd`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}


//  删除合同
export async function contractDel(id) {
  return request(`/quality/contract/del/${id}`,{
    method:'POST',
    // body:JSON.stringify()
  })
}


//  服务商列表
export async function providerList(params) {
  return request(`/quality/provider/listPage/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  更新服务商信息
export async function providerUpd(params) {
  return request(`/quality/provider/upd`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  删除服务商
export async function providerDel(id) {
  return request(`/quality/provider/del/${id}`,{
    method:'POST',
  })
}

//  新增评分细则
export async function scoreAdd(params) {
  return request(`/quality/score/add`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}


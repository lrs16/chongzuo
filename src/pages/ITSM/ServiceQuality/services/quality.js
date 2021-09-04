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
export async function contractProvider(params) {
  if(params.status) {
    return request(`/quality/contract/provider/${params.id}?status=${params.status}`)
  }

  if(!params.status) {
    return request(`/quality/contract/provider/${params.id}`)
  }

  return null
  
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

//  根据id查询评分细则
export async function scoreId(id) {
  return request(`/quality/score/${id}`)
}

//  评分细则条款列表
export async function scoreListpage(params) {
  return request(`/quality/score/listPage/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  新增详细条款
export async function clauseAdd(params) {
  return request(`/quality/clause/add`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  根据id查询详细条款数据
export async function clauseId(id) {
  return request(`/quality/clause/${id}`)
}  

//  删除评分细则
export async function scoreDel(id) {
  return request(`/quality/score/del/${id}`,{
    method:'POST',
  })
}

//  根据考核类型查询指标明细的树
export async function getTypeTree(type) {
  return request(`/quality/score/getTypeTree?type=${type}`)
}

//  详细条款列表
export async function clauseListpage(params) {
  return request(`/quality/clause/listPage/${params.pageNum}/${params.pageSize}`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  点击树获取右边表单信息
export async function getTargetValue(targetId) {
  return request(`/quality/score/getTargetValue?targetId=${targetId}`)
}


//  更新扣分说明
export async function updateRemark(id,remark) {
  return request(`/quality/scorecard/updateRemark?id=${id}&remark=${remark}`,{
    method:'POST',
    // body:JSON.stringify({id,remark})
  })
}

//  导出服务商
export async function providerExport(params) {
  return request(`/quality/provider/export`,{
    method:'POST',
    body:JSON.stringify(params),
    responseType:'blob',
  })
}


//  导出评分细则
export async function scoreExport(params) {
  return request(`/quality/score/export`, {
    method: 'POST',
    body: JSON.stringify(params),
    responseType: 'blob',
  });
}

//  更新条款
export async function clauseUpd(params) {
  return request(`/quality/clause/upd`,{
    method:'POST',
    body:JSON.stringify(params)
  })
}

//  删除条款
export async function clauseDel(id) {
  return request(`/quality/clause/del/${id}`,{
    method:'POST',
  })
}


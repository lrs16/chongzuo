import request from '@/utils/request';

//  获取登录用户TOP
export async function getLoginUserTop(params) {
  return request(`/common/function/getLoginUserTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  获取菜单点击数TOP
export async function getTabClickNumTop(params) {
  return request(`/common/function/getTabClickNumTop`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}
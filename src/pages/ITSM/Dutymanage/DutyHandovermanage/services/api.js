import request from '@/utils/request';

  //  保存值班交接
  export async function logbookSave(params) {
    return request(`/duty/logbook/save`,{
      method:'POST',
      body:JSON.stringify(params)
    })
  }

  //  删除值班
  export async function logbookDel(id) {
    return request(`/duty/logbook/del`,{
      method:'POST',
      data:id,
      requestType:'form'
    })
  }

  //  下载值班交接
  export async function download(params) {
    return request(`/duty/logbook/download`,{
      method:'POST',
      data:params,
      requestType:'form',
      responseType:'blob'
    })
  }

  //  回退交接
  export async function fallback(params) {
    return request(`/duty/logbook/fallback`,{
      method:'POST',
      data:params,
      requestType:'form'
    })
  }

  //  我的交接班
  export async function logbookFallback(params) {
    return request(`/duty/logbook/fallback`,{
      method:'POST',
      data:params,
      requestType:'form'
    })
  }


  // 查询值班
  export async function logbookSearch(params) {
    return request(`/duty/logbook/search`,{
      method:'POST',
      data:params,
      requestType:'form'
    })
  }

  // 确认交接
  export async function logbookTransfer(params) {
    return request(`/duty/logbook/transfer`,{
      method:'POST',
      data:params,
      requestType:'form'
    })
  }

    // 确认交接
    export async function logbookMy(params) {
      return request(`/duty/logbook/my`,{
        method:'POST',
        requestType:'form'
      })
    }



  //  根据当前登录账号获取值班人员
  export async function currentUser() {
    return request(`/duty/staff/currentUser`)
  }

  //  根据班组ID查询班次
  export async function shiftGroup(params) {
    return request(`/duty/shift/group/?groupId=${params.groupId}`)
  }

   //  根据值班日志id查询值班日志
   export async function logbookId(id) {
    return request(`/duty/logbook/${id}`)
  }


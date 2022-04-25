import request from '@/utils/request';

// 机房获取故障清单
export async function getTroubleByComputerRoom(params) {
  return request(`/report/getTroubleByComputerRoom?time1=${params.startTime}&time2=${params.endTime}`)
}

//  新增周报，获取maindId
export async function addReport() {
  return request(`/report/add`,{
    method:'POST'
  })
}

//  保存机房月报
export async function saveComputerRoomByMonth(params) {
  return request(`/report/saveComputerRoomByMonth`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}


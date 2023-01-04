import request from '@/utils/request';

// 是否超时 
export async function judgeTimeoutStatus(params) {
  return request(`/common/function/judgeTimeoutStatus`, {
    method: 'POST',
    data: { taskId: params },
    requestType: 'form',
  });
}

// 保存超时信息
export async function saveTimeoutMsg(params) {
  return request(`/common/msg/save`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 保存发布超时信息（临时使用接口）
// export async function saveReleaseTimeoutMsg(params) {
//   return request(`http://172.16.10.132:9901/common/msg/save`, {
//     method: 'POST',
//     data: params,
//     requestType: 'form',
//   });
// }
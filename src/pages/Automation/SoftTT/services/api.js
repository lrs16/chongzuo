// import request from '@/utils/request';

// // 主机信息
// export async function savaHostInfo(params) {
//   return request(`/auto/hosts`, {
//     method: 'POST',
//     body: JSON.stringify(params),
//   });
// }

// export async function editHostInfo(params) {
//   return request(`/auto/hosts`, {
//     method: 'PUT',
//     body: JSON.stringify(params),
//   });
// }

// export async function removeHostInfo(id) {
//   // const hostid = stringify(id);
//   return request(`/auto/hosts/${id}`, {
//     method: 'DELETE',
//   });
// }

// //主机列表

// //主机查询的接口
// export async function searchHosts(page,limit) {
//   return request(`/auto/hosts/listPage`, {
//     method:'POST',
//     // body: JSON.stringify(params),
//     body:{
//       "page":page,
//       "limit":limit,
//     },
//   });
// }
// export async function searchHosts(params) {
//   console.log('pp');
//   return request(`/auto/hosts/listPage`, {
//     method: 'POST',
//     body: JSON.stringify(params),
//   });
// }
// 软件
export async function searchSofts(params) {
  return request(`/auto/softwares/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function rightShuttlebox(hostId) {
  return request(`/auto/hosts/getSoftwaresByHostId/${hostId}`);
}

export async function updatehostrole(hostId,sofvalue) {
  return request(`/auto/hosts/${hostId}/softwareIds`,{
    method:'POST',
    body: JSON.stringify(sofvalue),
  });
}
// 软件
export async function softleftShuttle(params) {
  return request(`/auto/courses/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function softrightShuttle(softId) {
  return request(`/auto/softwares/getCoursesBySoftId/${softId}`);
}

export async function updatesoftrole(softwareId,coursevalue) {
  return request(`/auto/softwares/${softwareId}/courseIds`,{
    method:'POST',
    body: JSON.stringify(coursevalue)
  })
}

// 进程的接口
// 列表
export async function searchProcess(params) {
  return request(`/auto/courses/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}



// // 软件的接口
// //列表
// // export async function searchSofts(params) {
// //   return request(`/auto/softwares/listPage`, {
// //     method: 'POST',
// //     data: params,
// //     requestType: 'form',
// //   });
// // }

// // export async function searchSofts(page,limit) {
// //   return request(`/auto/hosts/listPage`, {
// //     method: 'POST',
// //     body: JSON.stringify({page,limit}),
// //   });
// // }

// export async function querySaveSoft(params) {
//   return request(`/auto/softwares`, {
//     method: 'POST',
//     body: JSON.stringify(params),
//   });
// }

// export async function queryEditSoft(params) {
//   return request(`/auto/softwares`, {
//     method: 'PUT',
//     body: JSON.stringify(params),
//   });
// }

// export async function queryRemoveSoft(id) {
//   return request(`/auto/softwares/${id}`, {
//     method: 'DELETE',
//   });
// }


// export async function processShuttlebox() {
//   return request(`/api/processShuttlebox`);
// }


// // export async function updatehostrole(hostId,sofvalue) {
// //   return request(`/auto/hosts/${hostId}/softwareIds`,{
// //     method:'POST',
// //     body: JSON.stringify(sofvalue),
// //   });
// // }

// // 程序执行
// export async function querySoftExetute() {
//   return request(`/api/softexetuteList`);
// }

// // 请求进程列表
// // export async function queryProcessList() {
// //   return request(`/api/processList`);
// //   return request(`/api-meter-auto/auto_courses/listPage`, {
// //     method: 'post',
// //     data: params,
// //     requestType: 'form'
// //   });
// // }

// // 进程查询
// export async function searchProcess() {
//   return request(`/api-meter-auto/auto_courses`, {
//     method: 'GET',
//     //   body: JSON.stringify(params),
//   });
// }

// // export async function searchProcess(params) {
// //   return request(`/api-meter-auto/auto_courses/listPage`, {
// //     method: 'POST',
// //     data: params,
// //     requestType: 'form',
// //   });
// // }

// // 进程添加
// export async function addProcess(params) {
//   return request('/api-meter-auto/auto_courses', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   });
// }

// // 进程删除
// export async function removeProcess(id) {
//   return request(`/api-meter-auto/auto_courses/${id}`, {
//     method: 'DELETE',
//   });
// }

// // 进程编辑、更新
// export async function editeProcess(params) {
//   return request(`/api-meter-auto/auto_courses`, {
//     method: 'PUT',
//     body: JSON.stringify(params),
//   });
// }

import request from '@/utils/request';

// 请求主机列表
export async function myHosts(params) {
  console.log('ik');
  return request(`/auto/hosts/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

import request from '@/utils/request';

export async function problemList() {
  return request(`/api/problemList`);
}

//  待办
export async function besolveList() {
  return request(`/api/besolveList`,{
    method:'POST',
    // body: JSON.stringify()
  })
}
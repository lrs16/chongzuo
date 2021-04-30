import request from '@/utils/request';

//  我的周报列表展示
export async function myweeklyTable() {
  return request(`/api/myWeeklyreport`)
}
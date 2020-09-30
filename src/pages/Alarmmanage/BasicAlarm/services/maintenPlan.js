import { stringify } from 'qs';
import request from '@/utils/request';

//维护计划的列表
export async function mainplayList() {
  return request(`/api/mainplayList`);
}

export async function mainplaySave() {
  return request(`/api/mainplayList`);
}

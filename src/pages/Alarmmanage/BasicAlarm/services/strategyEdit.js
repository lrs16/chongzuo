import { stringify } from 'qs';
import request from '@/utils/request';

//告警策略的列表
export async function strategyList() {
  return request(`/api/strategyList`);
}
//告警策略的详细数据
export async function strategyDetail() {
  return request(`/api/AlarmStrategy`);
}
//告警策略的第一个表的数据
export async function strategyTableone() {
  return request(`/api/tableOne`);
}
//告警策略的第二个表的数据
export async function strategyTabletwo() {
  return request(`/api/tableTwo`);
}

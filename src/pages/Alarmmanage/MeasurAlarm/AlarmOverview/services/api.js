// import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryAlarmList() {
  return request(`/api/alarmmanage/overview`);
}

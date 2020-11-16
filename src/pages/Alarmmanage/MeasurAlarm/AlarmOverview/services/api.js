// import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryAlarmList() {
  return request(`/api/alarmmanage/overview`);
}

export async function configAlarmList(selectedRowKeys) {
  return request(`/api/alarmmanage/configalarm?keys=${selectedRowKeys}`);
}

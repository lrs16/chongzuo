import request from '@/utils/request';

export async function queryAlarmSetting() {
  return request(`/api/alarmmanage/alarmsetting`);
}

import { stringify } from 'qs';
import request from '@/utils/request';

//当前告警的列表,列表和详情和当前告警一样
export async function currentList() {
  return request(`/api/historyList`);
}
export async function currentBasic() {
  return request(`/api/historyAlarmBasic`);
}
//操作记录
export async function currentOpera() {
  return request(`/api/historyAlarmOpera`);
}
//告警历史
export async function currentHistory() {
  return request(`/api/alarmHistory`);
}
//告警通知
export async function currentAlarmNotification() {
  return request(`/api/alarmNotification`);
}

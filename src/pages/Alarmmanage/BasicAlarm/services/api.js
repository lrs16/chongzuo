import { stringify } from 'qs';
import request from '@/utils/request';

//
export async function queryDetail(params) {
  return request(`/api/detailsList?${stringify(params)}`);
}

// 获取告警详细信息，包括告警基本信息和告警历史
export async function queryDetailBasic(detailsid) {
  return request(`/api/alarm/details?detailsid=${detailsid}`);
}

// 获取告警详细信息，操作历史
export async function queryOperats(params) {
  return request(`/api/alarm/operatlist?${stringify(params)}`);
}

// 获取告警规则
export async function queryQuotasrules(params) {
  return request(`/api/setting_list?${stringify(params)}`);
}

//获取历史告警的列表
export async function historyList() {
  return request(`/api/historyList`);
}
//历史告警详情页
//基本信息
export async function historyBasic() {
  return request(`/api/historyAlarmBasic`);
}
//操作记录
export async function historyOpera() {
  return request(`/api/historyAlarmOpera`);
}
//告警历史
export async function alarmHistory() {
  return request(`/api/alarmHistory`);
}
//告警通知
export async function alarmNotification() {
  return request(`/api/alarmNotification`);
}

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

export async function confirmWarning() {
  return request(`/api/historyList`);
}

export async function cancelConfirmation() {
  return request(`/api/historyList`);
}

export async function currentalarmClose() {
  return request(`/api/historyList`);
}

// import { stringify } from 'qs';
import request from '@/utils/request';

// 告警概览:列表
export async function queryAlarmList() {
  return request(`/api/alarmmanage/overview`);
}

// 告警概览:饼图
export async function AlarmoverDonut() {
  return request(`/api/alarmmanage/overviewdonut`);
}

// 告警概览:曲线图
export async function AlarmoverSmooth() {
  return request(`/api/alarmmanage/overviewsmooth`);
}

// 告警概览：确认告警
export async function configAlarmList(selectedRowKeys) {
  return request(`/api/alarmmanage/configalarm?keys=${selectedRowKeys}`);
}

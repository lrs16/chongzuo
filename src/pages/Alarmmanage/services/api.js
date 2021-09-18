// import { stringify } from 'qs';
import request from '@/utils/request';

// 告警概览:列表
export async function queryAlarmList(params) {
  return request(`/api/alarmmanage/overview`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 告警概览:饼图
export async function AlarmoverDonut(key) {
  return request(`/api/alarmmanage/typedonut?key=${key}`, {
    method: 'GET',
  });
}

// 告警概览:曲线图
export async function AlarmoverSmooth(key) {
  return request(`/api/alarmmanage/overviewsmooth?key=${key}`);
}

// 告警概览：确认告警
export async function configAlarmList(selectedRowKeys) {
  return request(`/api/alarmmanage/configalarm?keys=${selectedRowKeys}`);
}

// 计量业务告警统计
export async function statisticsItems({ beginDate, endDate }) {
  return request(`/warn/biz/statistics?beginDate=${beginDate}&endDate=${endDate}`, {
    method: 'GET'
  });
}

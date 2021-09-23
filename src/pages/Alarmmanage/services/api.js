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

// 确认告警
export async function configStatus(params) {
  return request(`/warn/biz/updateConfirmStatus`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 计量业务告警统计
export async function statisticsItems(params) {
  return request(`/warn/biz/statistics`, {
    method: 'GET',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 计量业务告警查询列表
export async function warmBizList(params) {
  return request(`/warn/biz/list`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 计量业务告警带统计页签
export async function bizlistStatistics(params) {
  return request(`/warn/biz/listStatistics`, {
    method: 'POST',
    data: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 人工消除告警updateClearStatus
export async function updateClearStatus(params) {
  return request(`/warn/biz/updateClearStatus`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
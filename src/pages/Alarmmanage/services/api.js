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
export async function AlarmoverDonut(params) {
  return request(`/warn/biz/pieChartData`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 告警概览:曲线图
export async function AlarmoverSmooth(params) {
  return request(`/warn/biz/lineChartData`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
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

// 操作记录/warn/biz/statusLog
export async function statusLog(params) {
  return request(`/warn/biz/statusLog`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 当月告警历史/warn/biz/hisWarnList
export async function hisWarnList(params) {
  return request(`/warn/biz/hisWarnList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
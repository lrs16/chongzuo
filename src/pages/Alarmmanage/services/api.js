import { stringify } from 'qs';
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
  return request(`/warn/biz/statistics?${stringify(params)}`, {
    method: 'POST',
    requestType: 'form',
  });
}

// 计量业务告警查询列表
export async function warmBizList(params) {
  return request(`/warn/biz/list`, {
    method: 'POST',
    body: JSON.stringify(params),
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

// 生成工单 /warn/biz/createOrder
export async function createOrder(params) {
  return request(`/warn/biz/createOrder`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 获取已生成工单/warn/biz/getOrder
export async function getOrder(params) {
  return request(`/warn/biz/getOrder`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 告警配置 其它告警配置列表（主机、软件、时钟）
export async function thresholdList() {
  return request(`/inspect/threshold/list`, {
    method: 'GET',
  });
}

// 告警配置 配置列表
export async function configureList(id) {
  return request(`/inspect/threshold/configureList?id=${id}`, {
    method: 'GET',
  });
}

// 告警配置 修改配置
export async function updateConfigure(params) {
  return request(`/inspect/threshold/updateConfigure`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 告警配置 四大区主机告警 获得应用程序监控阀值
export async function getAppMonitorData() {
  return request(`/auto/soft/app/getAppMonitorConf`, {
    method: 'GET',
  });
}


// 告警配置 四大区主机告警 设置应用程序监控阀值
export async function setAppMonitorConf(params) {
  return request(`/auto/soft/app/setAppMonitorConf`, {
    method: 'POST',
    body: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// 告警导出
export async function downloadExport(params) {
  return request(`/warn/biz/export`, {
    method: 'POST',
    body: JSON.stringify(params),
    requestType: 'formjosn',
    responseType: 'blob',
  });
}

// /warn/sms/userList告警联系人设置-列表数据
export async function userList(params) {
  return request(`/warn/sms/userList`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// /warn/sms/saveUser保存告警通知人
export async function saveUser(params) {
  return request(`/warn/sms/saveUser`, {
    method: 'POST',
    body: JSON.stringify(params),
    requestType: 'formjosn',
  });
}

// /warn/sms/delUser删除告警通知人
export async function delUser(params) {
  return request(`/warn/sms/delUser`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

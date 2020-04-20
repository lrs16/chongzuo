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

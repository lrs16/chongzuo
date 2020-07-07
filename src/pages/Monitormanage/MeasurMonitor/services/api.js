import { stringify } from 'qs';
import request from '@/utils/request';
// 请求脚本列表
export async function queryTreecompactdata(params) {
  return request(`/api/queryTreecompact_data?${stringify(params)}`);
}

export async function queryFacadata(params) {
  return request(`/api/queryfaca_data?${stringify(params)}`);
}

// 请求完整率
export async function queryCompleterate(area) {
  return request(`/cjzb/wzl/${area}`);
}

// 终端覆盖率
export async function queryCoverage(area) {
  return request(`/cjzb/fgl/${area}`);
}

// 抄表率
export async function queryMeterread(area) {
  return request(`/cjzb/cbl/${area}`);
}

// 关口零点采集
export async function queryZeroread() {
  return request(`/cjzb/gk0d`);
}

// 关口整点采集
export async function queryHourread() {
  return request(`/cjzb/gkzd`);
}

// 关口售电量
export async function querySales(area) {
  return request(`/cjzb/sdl/${area}`);
}

// 关口供电量
export async function querySupply(area) {
  return request(`/cjzb/gdl/${area}`);
}

// 抄表结算
export async function querySettlement() {
  return request(`/jkshhc/cbjsjk`);
}

// 档案同步
export async function queryArchives() {
  return request(`/jkshhc/datbjk`);
}

// 参考下发
export async function queryIssue() {
  return request(`/jkshhc/csxf`);
}

// 档案召测测试
export async function queryFiletest() {
  return request(``);
}

// 测量点主表生成Main table
export async function queryMaintable() {
  return request(`/jkshhc/cldzbsc`);
}

// 费控指令-KAFKA指令超时order
export async function queryOrder() {
  return request(`/jkshhc/fkzl/kafkazlcs`);
}

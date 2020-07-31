import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTreecompactdata(params) {
  return request(`/api-monitoring-business/api/queryTreecompact_data?${stringify(params)}`);
}

export async function queryFacadata(params) {
  return request(`/api-monitoring-business/api/queryfaca_data?${stringify(params)}`);
}

// 请求完整率
export async function queryCompleterate(area) {
  return request(`/api-monitoring-business/cjzb/wzl/${area}`);
}

// 终端覆盖率
export async function queryCoverage(area) {
  return request(`/api-monitoring-business/cjzb/fgl/${area}`);
}

// 抄表率
export async function queryMeterread(area) {
  return request(`/api-monitoring-business/cjzb/cbl/${area}`);
}

// 关口零点采集
export async function queryZeroread() {
  return request(`/api-monitoring-business/cjzb/gk0d`);
}

// 关口整点采集
export async function queryHourread() {
  return request(`/api-monitoring-business/cjzb/gkzd`);
}

// 关口售电量
export async function querySales(sortarea) {
  return request(`/api-monitoring-business/cjzb/sdl/${sortarea}`);
}

// 关口供电量
export async function querySupply(sortarea) {
  return request(`/api-monitoring-business/cjzb/gdl/${sortarea}`);
}

// 抄表结算
export async function querySettlement() {
  return request(`/api-monitoring-business/jkshhc/cbjsjk`);
}

// 档案同步
export async function queryArchives() {
  return request(`/api-monitoring-business/jkshhc/datbjk`);
}

// 参考下发
export async function queryIssue() {
  return request(`/api-monitoring-business/jkshhc/csxf`);
}

// 档案召测测试
export async function queryFiletest() {
  return request(`/api-monitoring-business/jkshhc/dacsxf`);
}

// 测量点主表生成Main table
export async function queryMaintable() {
  return request(`/api-monitoring-business/jkshhc/cldzbsc`);
}

// 费控指令-KAFKA指令超时order
export async function queryOrder() {
  return request(`/api-monitoring-business/jkshhc/fkzl/kafkazlcs`);
}

// 3区KAFKA节点
export async function getKafka3Zone() {
  return request(`/api-monitoring-business/kafka/3Zone`);
}

// 安全接入区KAFKA节点
export async function getKafkaSafeZone() {
  return request(`/api-monitoring-business/kafka/SafeZone`);
}

// 2区KAFKA节点
export async function getKafka2Zone() {
  return request(`/api-monitoring-business/kafka/2Zone`);
}

// 下行主题 低压相关
export async function getdownDY() {
  return request(`/api-monitoring-business/kafka/topicDown/DY`);
}

// 其他回复接口（低压相关）
export async function getdownOther() {
  return request(`/api-monitoring-business/kafka/topicDown/DYQTHFJK`);
}

// 广西102关口方面二区和安全接入区

export async function get102safeZone() {
  return request(`/api-monitoring-business/kafka/topicDown/102GK2ZoneAndSafeZone`);
}

// 广西102档案下发(关口相关)
export async function get102Down() {
  return request(`/api-monitoring-business/kafka/topicDown/102DA`);
}

// 上行主题 低压相关
export async function getupDY() {
  return request(`/api-monitoring-business/kafka/topicUp/DY`);
}

// 其他回复接口（低压相关）
export async function getupOther() {
  return request(`/api-monitoring-business/kafka/topicUp/DYQTHFJK`);
}

// 广西102关口方面二区和安全接入区1
export async function get102up2Zone() {
  return request(`/api-monitoring-business/kafka/topicUp/102GK2ZoneAndSafeZone1`);
}

// 广西102关口方面二区和安全接入区2
export async function get102upSafe2Zone() {
  return request(`/api-monitoring-business/kafka/topicUp/102GK2ZoneAndSafeZone2`);
}

// 其他回复接口 (广西102关口方面-二区和安全接区)
export async function get102upSafeZone() {
  return request(`/api-monitoring-business/kafka/topicUp/102GK2ZoneAndSafeZoneQTHFJK`);
}

// 登录检测
export async function getOnlineState() {
  return request(`/api-monitoring-business/zzxt/onlinestate`);
}

// 召测状态，已完成”配变“”低压“
export async function getZC(type) {
  return request(`/api-monitoring-business/zzxt/zc/${type}`);
}

// gkrk/zxl终端工况-在线率
export async function getOnlinerate() {
  return request(`/api-monitoring-business/gkrk/zxl`);
}

// /gkrk/rk/hourly入库数量（每小时）
export async function gethourly() {
  return request(`/api-monitoring-business/gkrk/rk/hourly`);
}

// /gkrk/rk/specially/2-4时
export async function getspecially() {
  return request(`/api-monitoring-business/gkrk/rk/specially`);
}

// /gkrk/rk/history入库量历史查询
export async function gethistory() {
  return request(`/api-monitoring-business/gkrk/rk/history`);
}

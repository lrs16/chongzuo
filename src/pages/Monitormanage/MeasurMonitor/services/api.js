import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryTreecompactdata(params) {
  return request(`/api-monitoring-business/api/queryTreecompact_data?${stringify(params)}`);
}

export async function queryFacadata(params) {
  return request(`/api-monitoring-business/api/queryfaca_data?${stringify(params)}`);
}

// 请求完整率，检查完毕
export async function queryCompleterate(sortarea) {
  return request(`/monitor/gatherKpi/wzl?currentPage=1&pageSize=1&area=${sortarea}`);
}

// 终端覆盖率，检查完毕
export async function queryCoverage(sortarea) {
  return request(`/monitor/gatherKpi/fgl?currentPage=1&pageSize=1&area=${sortarea}`);
}

// 抄表率,检查完毕
export async function queryMeterread(sortarea) {
  return request(`/monitor/gatherKpi/cbl?currentPage=1&pageSize=1&area=${sortarea}`);
}

// 关口零点采集，检查完毕
export async function queryZeroread() {
  return request(`/monitor/gatherKpi/gk0d`);
}

// 关口整点采集，检查完毕
export async function queryHourread() {
  return request(`/monitor/gatherKpi/gkzd`);
}

// 关口售电量，检查完毕
export async function querySales(sortarea) {
  return request(`/monitor/gatherKpi/sdl?currentPage=1&pageSize=12&area=${sortarea}`);
}

// 关口供电量，检查完毕
export async function querySupply(area) {
  return request(`/monitor/gatherKpi/gdl?currentPage=1&pageSize=12&area=${area}`);
}

// 抄表结算，检查完毕(后端未完成)
export async function querySettlement() {
  return request(`/monitor/interfaceCheck/cbjsjk`);
}

// 档案同步，检查完毕
export async function queryArchives() {
  return request(`/monitor/interfaceCheck/datbjk?currentPage=1&pageSize=12`);
}

// 参数下发，检查完毕
export async function queryIssue() {
  return request(`/monitor/interfaceCheck/csxf`);
}

// 档案召测测试，检查完毕
export async function queryFiletest() {
  return request(`/monitor/interfaceCheck/dacsxf`);
}

// 测量点主表生成Main table，检查完毕
export async function queryMaintable() {
  return request(`/monitor/interfaceCheck/cldzbsc?currentPage=1&pageSize=12`);
}

// 费控指令-KAFKA指令超时order，检查完毕
export async function queryOrder() {
  return request(`/monitor/interfaceCheck/fkzl/kafkazlcs`);
}

// 3区KAFKA节点，接口未解决
export async function getKafka3Zone() {
  return request(`/api-monitoring-business/kafka/3Zone`);
}

// 安全接入区KAFKA节点，接口未解决
export async function getKafkaSafeZone() {
  return request(`/api-monitoring-business/kafka/SafeZone`);
}

// 2区KAFKA节点，接口未解决
export async function getKafka2Zone() {
  return request(`/api-monitoring-business/kafka/2Zone`);
}

// 下行主题 低压相关，检查完毕
export async function getdownDY() {
  return request(`/monitor/kafka/topicDown/DY`);
}

// 下行主题,其他回复接口（低压相关），检查完毕
export async function getdownOther() {
  return request(`/monitor/kafka/topicDown/DYQTHFJK`);
}

// 广西102关口方面二区和安全接入区，检查完毕
export async function get102safeZone() {
  return request(`/monitor/kafka/topicDown/102GK2ZoneAndSafeZone`);
}

// 广西102档案下发(关口相关)，检查完毕
export async function get102Down() {
  return request(`/monitor/kafka/topicDown/102DA`);
}

// 上行主题 低压相关，检查完毕
export async function getupDY() {
  return request(`/monitor/kafka/topicUp/DY`);
}

// 其他回复接口（低压相关），检查完毕
export async function getupOther() {
  return request(`/monitor/kafka/topicUp/DYQTHFJK`);
}

// 广西102关口方面二区和安全接入区1，检查完毕
export async function get102up2Zone() {
  return request(`/monitor/kafka/topicUp/102GK2ZoneAndSafeZone1`);
}

// 广西102关口方面二区和安全接入区2，检查完毕
export async function get102upSafe2Zone() {
  return request(`/monitor/kafka/topicUp/102GK2ZoneAndSafeZone2`);
}

// 其他回复接口 (广西102关口方面-二区和安全接区)，检查完毕
export async function get102upSafeZone() {
  return request(`/monitor/kafka/topicUp/102GK2ZoneAndSafeZoneQTHFJK`);
}

// 登录检测,主站可用情况
export async function getOnlineState() {
  return request(`/monitor/master/onlinestate`);
}

// 召测状态，已完成”配变“”低压“，检查完毕
export async function getZC(type) {
  return request(`/monitor/master/zc?type=${type}`);
}

// gkrk/zxl终端工况-在线率，检查完毕
export async function getOnlinerate() {
  return request(`/monitor/terminalInfo/zxl`);
}

// /gkrk/rk/hourly入库数量（每小时），检查完毕
export async function gethourly() {
  return request(`/monitor/terminalInfo/rk/hourly`);
}

// /gkrk/rk/specially/0-8时，检查完毕
export async function getspecially() {
  return request(`/monitor/terminalInfo/rk/specially`);
}

// /gkrk/rk/history入库量历史查询，检查完毕
export async function gethistory(params) {
  return request(`/monitor/terminalInfo/rk/history?${stringify(params)}`);
}

// 计量业务监测配置

// export async function configurationList() {
//   return request(`/api/configurationList`);
// }

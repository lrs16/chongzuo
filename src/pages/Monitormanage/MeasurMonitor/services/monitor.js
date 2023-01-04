import { stringify } from 'qs';
import request from '@/utils/request';


// 计量业务监测配置列表
export async function configurationList() {
  return request(`/warn/biz/config/mainList`,{
    method:'POST',
  });
}

//  保存计量业务监测配置
export async function saveConfiguration(params) {
  return request(`/warn/biz/config/saveConfigMain`,{
    method:'POST',
    data:params,
    requestType:'form'
  });
}
//  批量保存计量业务监测配置
export async function batchsaveConfiguration(params) {
  switch (params.tableSign) {
    case '采集完整率配置':
    case '日冻结电能量':
      return request(`/warn/biz/config/saveAlarmBatch`,{
        method:'POST',
        body:JSON.stringify(params.data),
      });
    case '档案参数下发召测配置':
    case '登录检测配置':
    case '上下行报文监测告警配置':
      return request(`/warn/biz/config/saveTermConfigBatch`,{
        method:'POST',
        body:JSON.stringify(params.data),
      });
  }
}

// 计量业务监测配置详情
export async function configurationDetail(code,title) {
  switch (title) {
    case '采集完整率配置':
      case '采集完整率配置':
      case '日冻结电能量':
      return request(`/warn/biz/config/alarmList?code=${code}`);
    case '档案参数下发召测配置':
    case '登录检测配置':
    case '档案参数下发召测配置':
    case '上下行报文监测告警配置':
    return request(`/warn/biz/config/terminalList?code=${code}`);
    default:
      break;
  }
}

// 监控指令的表格接口
export async function instructionList(params) {
  return request(`/warn/biz/comm/commList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}

//  监控指令搜索接口
export async function instructionSearch(params) {
  return request(`/warn/biz/comm/commList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}


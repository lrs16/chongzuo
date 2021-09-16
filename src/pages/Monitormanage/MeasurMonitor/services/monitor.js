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
  //  告警保存
  if(params.showAlarmDialog) {
    return request(`/warn/biz/config/saveAlarmBatch`,{
      method:'POST',
      body:JSON.stringify(params.data),
      // requestType:'form'
    });
  }
//  终端保存
  if(params.showTerminalDialog) {
    return request(`/warn/biz/config/saveTermConfigBatch`,{
      method:'POST',
      body:JSON.stringify(params.data),
      // requestType:'form'
    });
  }
  return [];

}

// 计量业务监测配置详情
export async function configurationDetail(code,showAlarmDialog,showTerminalDialog) {
  if(showAlarmDialog) {
    return request(`/warn/biz/config/alarmList?code=${code}`);
  }
  if(showTerminalDialog) {
    return request(`/warn/biz/config/terminalList?code=${code}`);
  }
  return [];
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


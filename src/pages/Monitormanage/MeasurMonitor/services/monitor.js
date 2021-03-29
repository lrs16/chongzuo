import { stringify } from 'qs';
import request from '@/utils/request';


// 计量业务监测配置列表
export async function configurationList() {
  return request(`/check/config/mainList`);
}

//  保存计量业务监测配置
export async function saveConfiguration(params) {
  return request(`/check/config/saveConfigMain`,{
    method:'POST',
    data:params,
    requestType:'form'
  });
}
//  批量保存计量业务监测配置
export async function batchsaveConfiguration(params) {
  //  告警保存
  if(params.showAlarmDialog) {
    return request(`/check/config/saveAlarmBatch`,{
      method:'POST',
      body:JSON.stringify(params.data),
      // requestType:'form'
    });
  }
//  终端保存
  if(params.showTerminalDialog) {
    return request(`/check/config/saveTermConfigBatch`,{
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
    return request(`/check/config/alarmList?code=${code}`);
  }
  if(showTerminalDialog) {
    return request(`/check/config/terminalList?code=${code}`);
  }
  return [];
}

// 监控指令的表格接口
export async function instructionList(params) {
  return request(`/check/comm/commList?rowsPerPage=${params.rowsPerPage}&page=${params.page}&commStatus=${params.commStatus}`)
}

//  监控指令搜索接口
export async function instructionSearch(params) {
  return request(`/check/comm/commList`,{
    method:'POST',
    data:params,
    requestType:'form'
  })
}


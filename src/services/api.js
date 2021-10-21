import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

// 查询表格：请求数据
export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

// 查询表格：删除
export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}
// 查询表格：增加
export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

// 查询表格：编辑
export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

// 向后台发送登录请求
// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

// export async function getFakeCaptcha(mobile) {
//   return request(`/api/captcha?mobile=${mobile}`);
// }
// 脚本管理列表数据请求
export async function queryScriptListTable() {
  return request('/api/scriptlist');
}

export async function queryFactoryTypes() {
  return request('/api/factoryTypes');
}

// 请求组织，生成组织结构树
export async function queryDeptTree() {
  return request(`/upms/dept/list`);
}

// 请求主机， 生成结构树 /auto/hostsHandle/tree/hosts/  mxj
export async function queryHostTree(params) {
  return request(`/auto/hostsHandle/tree/hosts/`, {
    method: 'GET',
    body: JSON.stringify(params),
  });
}

// 数据字典结构树 /sys/dict/tree mxj
export async function querDictTree(params) {
  return request(`/sys/dict/tree`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 数据字典select /sys/dict/keyVal
export async function querkeyVal(dictModule, dictType) {
  return request(`/sys/dict/keyVal`, {
    method: 'POST',
    data: { dictModule, dictType },
    requestType: 'form',
  });
}

// 数据字典树型 /sys/dict/queryChildDictLower
export async function queryChildDictLower(params) {
  return request(`/sys/dict/queryChildDictLower`, {
    method: 'POST',
    body: JSON.stringify(params),
    requestType: 'jsonform',
  });
}

// 知识收录
export async function knowledgesaveByOrder(params) {
  return request(`/knowledge/flow/saveByOrder`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


// 菜单点击接口/common/function/setTabClickNum
export async function setTabClickNum(params) {
  return request(`/common/function/setTabClickNum`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

// 主网集成 /main/network/getToken
export async function getNetworkToken() {
  return request(`/main/network/getToken`);
}


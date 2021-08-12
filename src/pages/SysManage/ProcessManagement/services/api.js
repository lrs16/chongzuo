import request from '@/utils/request';

export async function searchModels(params) {
  return request(`/activiti/modeler/listPage`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function saveModels(params) {
  return request(`/activiti/modeler/create?key=${params.key}&name=${params.name}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function deleteModels(id) {
  return request(`/activiti/modeler/remove/${id}`, {
    method: 'DELETE',
  });
}

export async function editModels(id) {
  return request(`/modeler/modeler.html?modelId=${id}`, {
    method: 'GET',
  });
}

export async function releaseModels(modelId) {
  return request(`/activiti/modeler/deploy/${modelId}`, {
    method: 'GET',
  });
}

//  流程定义的接口

export async function definitionList(page, limit, bodyParams) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const a = encodeURI(encodeURI('中文', 'UTF-8'));
  return request(`/activiti/definition/listPage/${page}/${limit}`, {
    method: 'POST',
    body: JSON.stringify(bodyParams),
  });
}

//  图片资源
export async function imgResource(params) {
  return request(`/activiti/definition/readResource`, {
    method: 'POST',
    data:JSON.stringify(params),
    requestType: 'formjosn',
    responseType: 'blob',
  });
}

//  流程定义
export async function xmldataResource(params) {
  return request(`/activiti/definition/readResource`, {
    method: 'POST',
    data:JSON.stringify(params),
    requestType: 'formjosn',
  });
}

//  删除资源
export async function deleteDefinition(id) {
  return request(`/activiti/definition/remove/${id}`, {
    method: 'DELETE',
  });
}

//  激活或挂起
export async function stateChange(id, suspendState) {
  return request(`/activiti/definition/activeOrSuspend/${id}/${suspendState}`);
}

// 文件上传并部署
export async function definitionUpload(param) {
  return request(`/activiti/definition/upload`, {
    method: 'POST',
    data: param,
    requestType: 'form',
  });
}
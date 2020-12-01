import request from '@/utils/request';

export async function searchModels(params) {
  return request(`/activiti/modeler/listPage`,{
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function saveModels(params) {
  return request(`/activiti/modeler/create?key=${params.key}&name=${params.name}`,{
    method: 'POST',
    body:JSON.stringify(params),
  });
}

export async function deleteModels(id) {
  return request(`/activiti/modeler/remove/${id}`,{
    method: 'DELETE',
  });
}

export async function editModels(modelId) {
  return request(`/modeler/modeler.html?modelId=${modelId}`,{
    method:'GET'
  });
}



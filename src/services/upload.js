import request from '@/utils/request';

// 附件上传
export async function FileUpload(param) {
  return request(`/sys/file/upload`, {
    method: 'POST',
    data: param,
    requestType: 'form',
  });
}

// 文件下载
export async function FileDownload(id) {
  return request(`/sys/file/${id}`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 文件删除
export async function FileDelete(id) {
  return request(`/sys/file/${id}`, {
    method: 'DELETE',
  });
}

// 获取不允许上传文件类型
export async function getFileSecuritySuffix() {
  return request(`/sys/file/getFileSecuritySuffix`, {
    method: 'GET',
  });
}

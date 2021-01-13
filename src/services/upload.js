import request from '@/utils/request';

// 附件上传
export async function FileUpload() {
  return request(`/sys/file/upload`, {
    method: 'POST',
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

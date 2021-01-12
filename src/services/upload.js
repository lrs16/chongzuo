import request from '@/utils/request';

// 附件上传
// 需求登记流转
export async function FileUpload() {
  return request(`/sys/file/upload`, {});
}

import { stringify } from 'qs';
import request from '@/utils/request';

// // 请求
export async function getCurrUserInfo() {
  return request('/api-upms/upms_user/getCurrUserInfo');
}

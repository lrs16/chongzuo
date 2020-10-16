import { stringify } from 'qs';
import request from '@/utils/request';

// 计量业务监测配置

export async function configurationList() {
  return request(`/api/configurationList`);
}


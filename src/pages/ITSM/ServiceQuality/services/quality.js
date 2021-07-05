import request from '@/utils/request';

export async function maintenanceList () {
  return request(`/api/quality/maintenanceList`)
}


import request from '@/utils/request';

export async function maintenanceList () {
  return request(`/api/quality/maintenanceList`)
}

export async function tobeDealtdata () {
  return request(`/api/quality/tobeDealtdata`)
}


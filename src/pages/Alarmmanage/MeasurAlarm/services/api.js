import request from '@/utils/request';

export async function infoGrouplist() {
  return request(`/api/infogroup`);
}
export async function contactSettingslist(){
  return request(`/api/contactSettings`)
}
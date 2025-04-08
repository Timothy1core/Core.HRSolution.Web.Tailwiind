import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'

export const LIST_API_PERMISSION_URL = `${config.API_URL}/app/systemsetup/list_api_permission`;
export const CREATE_API_PERMISSION_URL = `${config.API_URL}/app/systemsetup/create_api_permission`;
export const INFO_API_PERMISSION_URL = `${config.API_URL}/app/systemsetup/info_api_permission`;
export const UPDATE_API_PERMISSION_URL = `${config.API_URL}/app/systemsetup/update_api_permission`;
export const REMOVE_API_PERMISSION_URL = `${config.API_URL}/app/systemsetup/remove_api_permission`;

export function listApiPermission(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_API_PERMISSION_URL, qs.stringify({ search, start: (page * size), draw: (page+1),  length: size, columns, sortDirection, sortColumnKey }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

export function createApiPermission(RoleId, ApiId) {
  return axios.post(CREATE_API_PERMISSION_URL, qs.stringify({ RoleId, ApiId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function infoApiPermission(id) {
  return axios.get(`${INFO_API_PERMISSION_URL}/${id}`);
}

export function updateApiPermission(id, ApiId, RoleId) {
  return axios.put(`${UPDATE_API_PERMISSION_URL}/${id}`, qs.stringify({ ApiId, RoleId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function removeApiPermission(id) {
  return axios.put(`${REMOVE_API_PERMISSION_URL}/${id}`);
}

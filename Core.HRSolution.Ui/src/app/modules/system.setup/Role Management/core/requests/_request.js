import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'
// ROLE Endpoints
export const CREATE_ROLE_URL = `${config.API_URL}/app/systemsetup/create_role`;
export const UPDATE_ROLE_URL = `${config.API_URL}/app/systemsetup/update_role`;
export const REMOVE_ROLE_URL = `${config.API_URL}/app/systemsetup/remove_role`;
export const INFO_ROLE_URL = `${config.API_URL}/app/systemsetup/info_role`;
export const LIST_ROLE_URL = `${config.API_URL}/app/systemsetup/list_role`;
// ROLE Endpoints


export function infoRole(id) {
  return axios.get(`${INFO_ROLE_URL}/${id}`);
}

export function updateRole(id, roleName) {
  return axios.put(`${UPDATE_ROLE_URL}/${id}`, qs.stringify({ roleName }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function removeRole(id) {
  return axios.put(`${REMOVE_ROLE_URL}/${id}`);
}

export function createRole(roleName) {
  return axios.post(CREATE_ROLE_URL, qs.stringify({ roleName }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function listRole(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_ROLE_URL, qs.stringify({ search, start: (page * size), draw: (page+1),  length: size, columns, sortDirection, sortColumnKey }),{
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

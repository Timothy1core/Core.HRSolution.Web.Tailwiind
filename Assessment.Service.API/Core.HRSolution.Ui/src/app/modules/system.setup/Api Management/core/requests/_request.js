import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'

export const LIST_API_URL = `${config.API_URL}/app/systemsetup/list_api`;
export const CREATE_API_URL = `${config.API_URL}/app/systemsetup/create_api`;
export const INFO_API_URL = `${config.API_URL}/app/systemsetup/info_api`;
export const UPDATE_API_URL = `${config.API_URL}/app/systemsetup/update_api`;
export const REMOVE_API_URL = `${config.API_URL}/app/systemsetup/remove_api`;

export function listApi(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_API_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
      });
    }

export function createApi(apiPermission) {
  return axios.post(CREATE_API_URL, qs.stringify({ apiPermission }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function infoApi(id) {
  return axios.get(`${INFO_API_URL}/${id}`);
}

export function updateApi(id, apiPermission) {
  return axios.put(`${UPDATE_API_URL}/${id}`, qs.stringify({ apiPermission }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function removeApi(id) {
  return axios.put(`${REMOVE_API_URL}/${id}`);
}

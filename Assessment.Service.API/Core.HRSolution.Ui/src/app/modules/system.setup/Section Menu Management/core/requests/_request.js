import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'

export const LIST_SECTION_MENU_URL = `${config.API_URL}/app/systemsetup/list_section_menu`;
export const CREATE_SECTION_MENU_URL = `${config.API_URL}/app/systemsetup/create_section_menu`;
export const INFO_SECTION_MENU_URL = `${config.API_URL}/app/systemsetup/info_section_menu`;
export const UPDATE_SECTION_MENU_URL = `${config.API_URL}/app/systemsetup/update_section_menu`;
export const REMOVE_SECTION_MENU_URL = `${config.API_URL}/app/systemsetup/remove_section_menu`;

export function listSectionMenu(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_SECTION_MENU_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
  }

export function createSectionMenu(
  SectionName,
  OrderBy) {
  return axios.post(CREATE_SECTION_MENU_URL, qs.stringify({ 
    SectionName,
    OrderBy }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function infoSectionMenu(id) {
  return axios.get(`${INFO_SECTION_MENU_URL}/${id}`);
}

export function updateSectionMenu(
  id,
  SectionName,
    OrderBy) {
  return axios.put(`${UPDATE_SECTION_MENU_URL}/${id}`, qs.stringify({ 
    SectionName,
    OrderBy }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function removeSectionMenu(id) {
  return axios.put(`${REMOVE_SECTION_MENU_URL}/${id}`);
}
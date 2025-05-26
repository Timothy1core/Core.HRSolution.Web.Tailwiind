import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'
export const LIST_MENU_URL = `${config.API_URL}/app/systemsetup/list_user_menu`;
export const CREATE_MENU_URL = `${config.API_URL}/app/systemsetup/create_user_menu`;
export const INFO_MENU_URL = `${config.API_URL}/app/systemsetup/info_api_menu`;
export const UPDATE_MENU_URL = `${config.API_URL}/app/systemsetup/update_user_menu`;
export const REMOVE_MENU_URL = `${config.API_URL}/app/systemsetup/remove_user_menu`;
export const DISABLE_MENU_URL = `${config.API_URL}/app/systemsetup/hide_user_menu`;

export function listMenu(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_MENU_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function listMenuDropDown(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_MENU_URL, qs.stringify({ search, start: 0, draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function createMenu(
  RoleId,
  MenuName, 
  MenuPath, 
  IsParent, 
  IsSubParent, 
  SectionMenuId, 
  ParentId,
  MenuIcon,
  OrderBy) {
  return axios.post(CREATE_MENU_URL, qs.stringify({ 
    RoleId,
    MenuName, 
    MenuPath, 
    IsParent, 
    IsSubParent, 
    SectionMenuId, 
    ParentId,
    MenuIcon,
    OrderBy }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function infoMenu(id) {
  return axios.get(`${INFO_MENU_URL}/${id}`);
}

export function updateMenu(
  id,
  RoleId,
  MenuName, 
  MenuPath, 
  IsParent, 
  IsSubParent, 
  SectionMenuId, 
  ParentId,
  MenuIcon,
  OrderBy) {
  return axios.put(`${UPDATE_MENU_URL}/${id}`, qs.stringify({ 
    RoleId,
    MenuName, 
    MenuPath, 
    IsParent, 
    IsSubParent, 
    SectionMenuId, 
    ParentId,
    MenuIcon,
    OrderBy }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function removeMenu(id) {
  return axios.put(`${REMOVE_MENU_URL}/${id}`);
}

export function updateMenuHiddenStatus(id, isHidden) {
  return axios.put(`${DISABLE_MENU_URL}/${id}`, qs.stringify({ isHidden }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

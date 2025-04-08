import config from '../../../../../config'
import axios from 'axios';

// Define API URL from environment variable

// Define API endpoints
export const GET_USER_BY_ACCESSTOKEN_URL = `${config.API_URL}/app/auth/verify_token`;
export const LOGIN_URL = `${config.API_URL}/app/auth/login`;
export const REQUEST_PASSWORD_URL = `${config.API_URL}/forgot_password`;
export const GET_USER_MENUS = `${config.API_URL}/app/auth/user_menus`;
export const GET_USER_ROUTES = `${config.API_URL}/app/auth/user_menu_paths`;

// Server should return AuthModel
export function login(email, password) {
  return axios.post(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, {
    email,
  });
}

// Server should return UserModel
export function getUserByToken() {
  return axios.get(GET_USER_BY_ACCESSTOKEN_URL, {
    // token: token,
  });
}

// Server should return UserModel
export function getUserMenus() {
  return axios.get(GET_USER_MENUS, {});
}

// Server should return UserModel
export function getUserMenuRoutes() {
  return axios.get(GET_USER_ROUTES, {});
}

import config from '../../../../../../config'
import axios from 'axios';

// Define API URL from environment variable

// Define API endpoints
export const  GET_CLIENT_COMPANY_DASHBOARD_URL = `${config.API_URL}/recruitment/client/retrieve_dashboard_client_company`;
export const  POST_CREATE_COMPANY_PROFILE_URL = `${config.API_URL}/recruitment/client/create_client_company`;
export const  GET_CLIENT_COMPANY_PROFILE_URL = `${config.API_URL}/recruitment/client/retrieve_client_company_profile`;
export const  PUT_UPDATE_CLIENT_COMPANY_PROFILE_URL = `${config.API_URL}/recruitment/client/update_client_company`;

export const  POST_CREATE_COMPANY_INDIVIDUAL_URL = `${config.API_URL}/recruitment/client/create_client_individual`;
export const  GET_COMPANY_INDIVIDUAL_URL = `${config.API_URL}/recruitment/client/retrieve_client_individuals`;
export const  PUT_UPDATE_COMPANY_INDIVIDUAL_URL = `${config.API_URL}/recruitment/client/update_client_individual`;


export const  GET_CLIENT_LOGO_URL = `${config.API_URL}/recruitment/client/client_logo`;
export const  GET_CORE_SERVICE_DROPDOWN_URL = `${config.API_URL}/recruitment/client/core_services_dropdown_list`;
export const  GET_CLIENT_STATUS_DROPDOWN_URL = `${config.API_URL}/recruitment/client/client_status_dropdown_list`;
export const  GET_CLIENT_DROPDOWN_URL = `${config.API_URL}/recruitment/client/client_dropdown_list`;
export const  GET_EMPLOYMENT_DROPDOWN_URL = `${config.API_URL}/recruitment/client/employment_dropdown_list`;
export const  GET_JOB_STATUS_DROPDOWN_URL = `${config.API_URL}/recruitment/client/job_status_dropdown_list`;
export const  GET_CLIENT_COMPANY_GROUP_DROPDOWN_URL = `${config.API_URL}/recruitment/client/client_company_group_list`;


// Server should return UserModel


export function SelectCompanyDashboard(groupId,serviceId, statusId) {
  const params = {};
  if (serviceId != null) {
    params.serviceId = serviceId;
  }
  if (statusId != null) {
    params.statusId = statusId;
  }
  if (groupId != null) {
    params.groupId = groupId;
  }
  return axios.get(GET_CLIENT_COMPANY_DASHBOARD_URL, { params })  // Pass params as an object
}

export function CreateCompanyProfile(formData) {
  return axios.post(POST_CREATE_COMPANY_PROFILE_URL,formData);
}


export function SelectCompanyProfileInformation(id) {
  return axios.get(`${GET_CLIENT_COMPANY_PROFILE_URL}/${id}`);
}

export function UpdateCompanyProfile(id,formData) {
  return axios.put(`${PUT_UPDATE_CLIENT_COMPANY_PROFILE_URL}/${id}`,formData);
}

export function CreateCompanyIndividual(formData) {
  return axios.post(POST_CREATE_COMPANY_INDIVIDUAL_URL,formData);
}

export function SelectClientIndividuals(id) {
  return axios.get(`${GET_COMPANY_INDIVIDUAL_URL}/${id}`);
}

export function UpdateClientIndividual(id,formData) {
  return axios.put(`${PUT_UPDATE_COMPANY_INDIVIDUAL_URL}/${id}`,formData);
}


export function SelectCoreServiceDropDown() {
  return axios.get(GET_CORE_SERVICE_DROPDOWN_URL);
}

export function SelectClientStatusDropDown() {
  return axios.get(GET_CLIENT_STATUS_DROPDOWN_URL);
}

export function SelectClientsDropDown() {
  return axios.get(GET_CLIENT_DROPDOWN_URL);
}

export function SelectEmployementDropDown() {
  return axios.get(GET_EMPLOYMENT_DROPDOWN_URL);
}

export function SelectJobStatusDropDown() {
  return axios.get(GET_JOB_STATUS_DROPDOWN_URL);
}

export function SelectClientCompanyGroupDropDown() {
  return axios.get(`${GET_CLIENT_COMPANY_GROUP_DROPDOWN_URL}`);
}

export function ApiGateWayUrl(){
  return config.API_URL;
}
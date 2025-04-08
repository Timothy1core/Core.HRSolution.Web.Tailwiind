import config from '../../../../../config'
import axios from 'axios';

// Define API URL from environment variable

// Define API endpoints
export const  POST_CREATE_TEMPLATE = `${config.API_URL}/recruitment/emailtemplate/create`;
export const  GET_DASHBOARD_TEMPLATE = `${config.API_URL}/recruitment/emailtemplate/dashboard`;
export const  PUT_DASHBOARD_TEMPLATE = `${config.API_URL}/recruitment/emailtemplate/update`;
export const  GET_ALL_JOBS_DROPDOWN = `${config.API_URL}/recruitment/jobprofile/retrieve_all_job_profile`;
export const  GET_JOBS_APPLICATION_PROCESS_DROPDOWN = `${config.API_URL}/recruitment/jobprofile/retrieve_application_process_dropdown`;
export const  GET_EMAIL_TEMPLATE_DROPDOWN = `${config.API_URL}/recruitment/emailtemplate/retrieve_dropdown`;

export const  POST_CREATE_AUTOMATION = `${config.API_URL}/recruitment/emailtemplate/create_automation`;
export const  PUT_UPDATE_AUTOMATION = `${config.API_URL}/recruitment/emailtemplate/update_automation`;
export const  GET_DASHBOARD_AUTOMATION = `${config.API_URL}/recruitment/emailtemplate/dashboard_automation`;


export function CreateEmailTemplate(formData) {
  return axios.post(POST_CREATE_TEMPLATE,formData);
}

export function SelectEmailTemplate() {
  return axios.get(GET_DASHBOARD_TEMPLATE) 
}

export function UpdateEmailTemplate(id,formData) {
  return axios.put(`${PUT_DASHBOARD_TEMPLATE}/${id}`,formData);
}


export function SelectAllJobProfileDropDown() {
  return axios.get(GET_ALL_JOBS_DROPDOWN) 
}

export function SelectJobApplicationProcessDropDown() {
  return axios.get(GET_JOBS_APPLICATION_PROCESS_DROPDOWN) 
}


export function SelectEmailTemplateDropDown() {
  return axios.get(GET_EMAIL_TEMPLATE_DROPDOWN) 
}


export function CreateEmailAutomation(formData) {
  return axios.post(POST_CREATE_AUTOMATION,formData);
}

export function UpdateEmailAutomation(id,formData) {
  return axios.put(`${PUT_UPDATE_AUTOMATION}/${id}`,formData);
}

export function SelectEmailAutomation() {
  return axios.get(GET_DASHBOARD_AUTOMATION) 
}
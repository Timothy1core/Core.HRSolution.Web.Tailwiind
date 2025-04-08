import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'

export const LIST_API_URL = `${config.API_URL}/recruitment/onboarding/list_onboarding_info`;

export const CREATE_ONBOARDING_INFORMATION_URL = `${config.API_URL}/recruitment/onboarding/save_onboarding_info`;
export const CREATE_ONBOARDING_DOCUMENTS_LIST_URL = `${config.API_URL}/recruitment/onboarding/save_onboarding_document`;
export const INFO_CANDIDATE_URL = `${config.API_URL}/recruitment/onboarding/onboarding_form_infos`;
export const INFO_ONBOARDING_URL = `${config.API_URL}/recruitment/onboarding/info_onboarding_info`;
export const GET_DASHBOARD_CLIENT_COMPANY_JOB_PROFILE_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_dashboard_job_profile`;
export const UPDATE_ONBOARDING_INFORMATION_URL = `${config.API_URL}/recruitment/onboarding/update_onboarding_info`;
export const UPDATE_WFH_INFORMATION_URL = `${config.API_URL}/recruitment/onboarding/update_wfh_info`;

export const ACKNOWLEDGE_ONBOARDING_FORM_URL = `${config.API_URL}/recruitment/onboarding/acknowledged_onboarding_form`;

export const SEND_PENDING_PRE_REQ_URL = `${config.API_URL}/recruitment/onboarding/send_email_pending_pre_docs`;
export const SEND_PENDING_GENERAL_REQ_URL = `${config.API_URL}/recruitment/onboarding/send_email_pending_general_docs`;


export const CREATE_WFH_INFORMATION_URL = `${config.API_URL}/recruitment/onboarding/save_wfh_info`;


export function listCandidate(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_API_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}


export function getOnboardingInfo(id) {
  return axios.get(`${INFO_ONBOARDING_URL}/${id}`);
}
export function getOnboardingFormInfo(id) {
  return axios.get(`${INFO_CANDIDATE_URL}/${id}`);
}

export function sendEmailForPendingPreReqDocs(id) {
  return axios.get(`${SEND_PENDING_PRE_REQ_URL}/${id}`);
}

export function sendEmailForPendingGeneralReqDocs(id) {
  return axios.get(`${SEND_PENDING_GENERAL_REQ_URL}/${id}`);
}



export function saveOnboardingInformation(formData) {
  return axios.post(CREATE_ONBOARDING_INFORMATION_URL,formData);
}

export function saveOnboardingDocuments(formData) {
  return axios.post(CREATE_ONBOARDING_DOCUMENTS_LIST_URL,formData);
}

export function saveWfhInformationSheet(formData) {
  return axios.post(CREATE_WFH_INFORMATION_URL,formData);
}

export function updateOnboardingFormInfo(id,formData) {
  return axios.put(`${UPDATE_ONBOARDING_INFORMATION_URL}/${id}`,formData);
}

export function updateWfhInformation(id,formData) {
  return axios.put(`${UPDATE_WFH_INFORMATION_URL}/${id}`,formData);
}


export function acknowledgeOnboardingForm(id, isAcknowledged) {
  return axios.put(`${ACKNOWLEDGE_ONBOARDING_FORM_URL}/${id}`, qs.stringify({ isAcknowledged }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function ApiGateWayUrl(){
  return config.API_URL;
}
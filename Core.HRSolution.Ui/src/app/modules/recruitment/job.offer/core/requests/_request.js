import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'


export const LIST_API_URL = `${config.API_URL}/recruitment/joboffer/list_for_job_offer`;
export const INFO_CANDIDATE_URL = `${config.API_URL}/recruitment/joboffer/info_job_offer`;
export const UPDATE_CANDIDATE_URL = `${config.API_URL}/recruitment/joboffer/update_job_offer_info`;
export const SAVE_CANDIDATE_SIGNATURE_URL = `${config.API_URL}/recruitment/joboffer/job_offer_approved`;
export const SALARY_DECLINED_URL = `${config.API_URL}/recruitment/joboffer/job_offer_salary_declined`;

export const CANDIDATE_JOBOFFER_ACCEPTED = `${config.API_URL}/recruitment/joboffer/job_offer_accepted`;
export const CANDIDATE_JOBOFFER_DECLINED = `${config.API_URL}/recruitment/joboffer/job_offer_declined`;

export const EXPORT_EXCEL_URL = `${config.API_URL}/recruitment/joboffer/job_offer_export_excel`;
export const INFO_EMAIL_CONTENT_URL = `${config.API_URL}/recruitment/joboffer/retrieve_email_body_content`;
export const SEND_EMAIL_JOB_OFFER = `${config.API_URL}/recruitment/joboffer/send_email_job_offer`;

export function listCandidate(search, columns, sortColumnKey, sortDirection, page, size, status) {
  return axios.post(LIST_API_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey, status }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function getJobOfferInfo(id) {
  return axios.get(`${INFO_CANDIDATE_URL}/${id}`);
}

export function updateJobOfferInfo(id,formData) {
  return axios.put(`${UPDATE_CANDIDATE_URL}/${id}`,formData);
}



export function saveApproveSignature(id, approverSignature) {
  return axios.put(`${SAVE_CANDIDATE_SIGNATURE_URL}/${id}`, qs.stringify({ approverSignature }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function salaryDeclined(id, approverNotes) {
  return axios.put(`${SALARY_DECLINED_URL}/${id}`, qs.stringify({ approverNotes }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function jobOfferAccepted(id, candidateSignature) {
  return axios.put(`${CANDIDATE_JOBOFFER_ACCEPTED}/${id}`, qs.stringify({ candidateSignature }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function jobOfferDeclined(id, candidateNotes) {
  return axios.put(`${CANDIDATE_JOBOFFER_DECLINED}/${id}`, qs.stringify({ candidateNotes }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function getEmailContent(id) {
  return axios.get(`${INFO_EMAIL_CONTENT_URL}/${id}`);
}

export function sendJobOffer(id) {
  return axios.get(`${SEND_EMAIL_JOB_OFFER}/${id}`);
}

export function exportExcel(id) {
  return axios.get(`${EXPORT_EXCEL_URL}/${id}`, {
    responseType: 'blob', // This is important for handling Excel files
  });
}

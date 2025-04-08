import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'


export const LIST_API_URL = `${config.API_URL}/recruitment/candidate/list_candidate`;
export const CREATE_COMMENT = `${config.API_URL}/recruitment/candidate/create_comment`;
export const INFO_API_URL = `${config.API_URL}/recruitment/candidate/info_candidate`;
export const GET_APPLICATION_PROCESS_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_application_process`;
export const GET_DASHBOARD_CLIENT_COMPANY_JOB_PROFILE_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_dashboard_job_profile`;

export const GET_CANDIDATE_FILTER_URL = `${config.API_URL}/recruitment/candidate/retrieve_candidate_filter`;

export const CREATE_WRITE_UP_URL = `${config.API_URL}/recruitment/candidate/create_candidate_write_up`;
export const INFO_WRITE_UP_URL = `${config.API_URL}/recruitment/candidate/write_up_info`;
export const UPDATE_WRITE_UP_URL = `${config.API_URL}/recruitment/candidate/update_write_up`;

export const UPDATE_STAGE_URL = `${config.API_URL}/recruitment/candidate/update_stage`;
export const UPDATE_JOB_URL = `${config.API_URL}/recruitment/candidate/update_job`;
export const MOVE_TO_JOB_URL = `${config.API_URL}/recruitment/candidate/copy_candidate_to_job`;

export const REMOVE_CANDIDATE_URL = `${config.API_URL}/recruitment/candidate/remove_candidate`;

export const DISQUALIFY_CANDIDATE_URL = `${config.API_URL}/recruitment/candidate/disqualify_candidate`;

export const GET_CANDIDATE_ASSESSMENT_FOR_CHECKING_URL = `${config.API_URL}/recruitment/candidate/retrieve_candidate_assessment_for_checking`;

export const CREATE_CANDIDATE_CREDENTIAL_URL = `${config.API_URL}/recruitment/candidate/create_candidate_credential`;


export const PIPELINE_URL = `${config.API_URL}/recruitment/pipeline/list_pipelines`;

export const SUBMIT_CANDIDATE_CORRECTION_URL = `${config.API_URL}/recruitment/candidate/submit_candidate_correction`;

export const CREATE_CALENDAR_EVENT_URL = `${config.API_URL}/recruitment/candidate/create_calendar_event`;

export const GET_ALL_CALENDAR_EVENTS_URL = `${config.API_URL}/recruitment/candidate/get_all_calendar_events`;

export const RETRIEVE_EMAILS_BY_DISTRO_URL = `${config.API_URL}/recruitment/candidate/retrieve_emails_by_distro`;

export const SAVE_JOB_OFFER_INFO = `${config.API_URL}/recruitment/joboffer/save_job_offer_info`;

export function listCandidate(search, columns, sortColumnKey, sortDirection, page, size, client, clientGroup, job, qualification, source, applicationProcess) {
  return axios.post(LIST_API_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey, client, clientGroup, job, qualification, source, applicationProcess }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}

export function listPipeline() {
  return axios.post(PIPELINE_URL, qs.stringify(),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
}



export function MoveToJob(formData) {
  return axios.post(MOVE_TO_JOB_URL,formData);
}

export function createComment(formData) {
  return axios.post(CREATE_COMMENT,formData);
}

export function createCandidateCredential(formData) {
  return axios.post(CREATE_CANDIDATE_CREDENTIAL_URL,formData);
}

export function infoCandidate(id) {
  return axios.get(`${INFO_API_URL}/${id}`);
}

export function removeCandidate(id) {
  return axios.put(`${REMOVE_CANDIDATE_URL}/${id}`);
}

export function disqualifyCandidate(id) {
  return axios.put(`${DISQUALIFY_CANDIDATE_URL}/${id}`);
}

export function submitAnswerCorrection(id, isCorrect) {
  return axios.put(`${SUBMIT_CANDIDATE_CORRECTION_URL}/${id}`, qs.stringify({ 
    isCorrect}), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function createWriteUp(
  CandidateId,
  ProfileOverview, 
  ProfessionalBackground, 
  Skills, 
  Behavioral, 
  Notes) {
  return axios.post(CREATE_WRITE_UP_URL, qs.stringify({ 
    CandidateId,
    ProfileOverview, 
    ProfessionalBackground, 
    Skills, 
    Behavioral, 
    Notes }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function infoWriteUp(id) {
  return axios.get(`${INFO_WRITE_UP_URL}/${id}`);
}

export function updateWriteUp(
  candidateId,
  ProfileOverview, 
  ProfessionalBackground, 
  Skills, 
  Behavioral, 
  Notes) {
  return axios.put(`${UPDATE_WRITE_UP_URL}/${candidateId}`, qs.stringify({ 
    ProfileOverview, 
    ProfessionalBackground, 
    Skills, 
    Behavioral, 
    Notes}), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function updateStage(
  candidateId,
  stageId, 
  stageName, 
  ) {
  return axios.put(`${UPDATE_STAGE_URL}/${candidateId}`, qs.stringify({ 
    stageId, 
    stageName, 
    }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function updateJob(
  candidateId,
  stageId, 
  stageName, 
  jobId,
  jobName,
  ) {
  return axios.put(`${UPDATE_JOB_URL}/${candidateId}`, qs.stringify({ 
    stageId, 
    stageName,
    jobId,
    jobName,
    }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function SelectApplicationProcess() {
  return axios.get(`${GET_APPLICATION_PROCESS_URL}`);
}

export function SelectJobProfiles() {
  return axios.get(`${GET_DASHBOARD_CLIENT_COMPANY_JOB_PROFILE_URL}`);
}
export function SelectFilterDropdown() {
  return axios.get(`${GET_CANDIDATE_FILTER_URL}`);
}

export function ApiGateWayUrl(){
  return config.API_URL;
}

export function listQuestionForChecking(candidateId, assessmentId) {
  return axios.get(`${GET_CANDIDATE_ASSESSMENT_FOR_CHECKING_URL}?candidateId=${candidateId}&assessmentId=${assessmentId}`);
}

export function createCalendarEvent(formData) {
  return axios.post(CREATE_CALENDAR_EVENT_URL,formData);
}

export function getAllCalendarEvents(recipient) {
  return axios.post(GET_ALL_CALENDAR_EVENTS_URL, qs.stringify({ 
    recipient
    }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}


export function retrieveEmailsByDistro(recipient) {
  return axios.post(RETRIEVE_EMAILS_BY_DISTRO_URL, qs.stringify({recipient})
  , {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function saveJobOfferInfo(formData) {
  return axios.post(SAVE_JOB_OFFER_INFO,formData);
}

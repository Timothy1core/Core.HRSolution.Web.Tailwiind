// import config from '../../../../../config'
import axios from 'axios';
import qs from 'qs';
// Define API URL from environment variable

import config from '../../../src/config'
// Define API endpoints
export const UPDATE_ASSESSMENT_ISSTARTED_STATUS = `${config.API_URL}/assessment/assessmentauth/update_assessment_is_started_status`;
export const UPDATE_ASSESSMENT_IS_FINISHED_STATUS = `${config.API_URL}/assessment/assessmentauth/update_assessment_is_finished_status`;
export const SET_CURRENT_ASSESSMENT_ID = `${config.API_URL}/assessment/assessmentauth/set_current_assessment_id`;
export const SUBMIT_ASSESSMENT_ANSWER = `${config.API_URL}/assessment/assessmentauth/submit_assessment_answer`;
export const SUBMIT_ASSESSMENT_REMAINING_TIMER = `${config.API_URL}/assessment/assessmentauth/submit_assessment_remaining_time`;
export const UPDATE_ASSESSMENT_REMAINING_TIMER = `${config.API_URL}/assessment/assessmentauth/update_assessment_remaining_time`;
export const SUBMIT_ASSESSMENT_DETAILS = `${config.API_URL}/assessment/assessmentauth/submit_assessment_details`;
export const SET_ASSESSMENT_MOUSE_OUT = `${config.API_URL}/assessment/assessmentauth/set_assessment_mouse_out`;
export const SUBMIT_CANDIDATE_SNAPSHOT = `${config.API_URL}/assessment/assessmentauth/submit_candidate_snapshot`;




// Server should return AuthModel

export function setIsStarted(id) {
  return axios.put(`${UPDATE_ASSESSMENT_ISSTARTED_STATUS}/${id}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function setAssessmentFinished(id, candidateId) {
  return axios.put(`${UPDATE_ASSESSMENT_IS_FINISHED_STATUS}/${id}`, qs.stringify({ candidateId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function setCurrentAssessment(id, assessmentId) {
  return axios.put(`${SET_CURRENT_ASSESSMENT_ID}/${id}`, qs.stringify({ assessmentId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function submitAnswer(formData) {
  return axios.post(SUBMIT_ASSESSMENT_ANSWER, formData)
}


export function submitSnapshot(formData) {
  return axios.post(SUBMIT_CANDIDATE_SNAPSHOT, formData)
}


export function submitRemainingTimer(remainingTime, candidateId, AssessmentId) {
  return axios.post(SUBMIT_ASSESSMENT_REMAINING_TIMER, qs.stringify({ remainingTime, candidateId, AssessmentId }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function updateRemainingTimer(id, remainingTime) {
  return axios.put(`${UPDATE_ASSESSMENT_REMAINING_TIMER}/${id}`, qs.stringify({ remainingTime }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function submitAssessmentDetails(id, isFullscreenExit, isMouseExited) {
  return axios.put(`${SUBMIT_ASSESSMENT_DETAILS}/${id}`, qs.stringify({ isFullscreenExit, isMouseExited }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function setAssessmentMouseOut(id, mouseOutsideCounter) {
  return axios.put(`${SET_ASSESSMENT_MOUSE_OUT}/${id}`, qs.stringify({ mouseOutsideCounter }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

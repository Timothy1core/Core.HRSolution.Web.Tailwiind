import axios from 'axios';
import qs from 'qs';

import config from '../../../../../../config'

export const LIST_ASSESSMENT_URL = `${config.API_URL}/recruitment/assessment/list_assessment`;
export const CREATE_ASSESSMENT_URL = `${config.API_URL}/recruitment/assessment/create_assessment`;  
export const INFO_ASSESSMENT_URL = `${config.API_URL}/recruitment/assessment/info_assessment`;
export const UPDATE_ASSESSMENT_URL = `${config.API_URL}/recruitment/assessment/update_assessment`;
export const REMOVE_ASSESSMENT_URL = `${config.API_URL}/recruitment/assessment/remove_assessment`;

export const LIST_QUESTION_TYPES = `${config.API_URL}/recruitment/assessment/list_question_types`;

export const CREATE_QUESTION_URL = `${config.API_URL}/recruitment/assessment/create_question`;  
export const UPDATE_QUESTION_URL = `${config.API_URL}/recruitment/assessment/update_question`;  
export const REMOVE_QUESTION_URL = `${config.API_URL}/recruitment/assessment/remove_question`;
// export const REMOVE_API_URL = `${API_URL}/remove_api`;

export function listAssessment(search, columns, sortColumnKey, sortDirection, page, size) {
  return axios.post(LIST_ASSESSMENT_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
      }

export function listQuestionTypes() {
  return axios.get(LIST_QUESTION_TYPES, {});
}

export function createAssessment(
  Name,
  Duration, 
  Instruction,
  Description,
  Questions) {
  return axios.post(CREATE_ASSESSMENT_URL, qs.stringify({ 
  Name,
  Duration,
  Instruction, 
  Description,
  Questions
   }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function createQuestion(
  AssessmentId,
  Body, 
  Type,
  Required,
  Marks,
  Answers,
  VideoDurations,
  Choices,
  ) {
  return axios.post(CREATE_QUESTION_URL, qs.stringify({ 
    AssessmentId,
    Body, 
    Type,
    Required,
    Marks,
    Answers,
    VideoDurations,
    Choices,
   }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function infoAssessment(id) {
  return axios.get(`${INFO_ASSESSMENT_URL}/${id}`);
}

export function removeAssessment(id) {
  return axios.put(`${REMOVE_ASSESSMENT_URL}/${id}`);
}

export function removeQuestion(id) {
  return axios.put(`${REMOVE_QUESTION_URL}/${id}`);
}

export function updateAssessment(
  id,
  Name,
  Instruction, 
  Description,
  Duration
) {
  return axios.put(`${UPDATE_ASSESSMENT_URL}/${id}`, qs.stringify({ 
  Name,
  Instruction,
  Description,
  Duration,}), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function updateQuestion(
    id,
    Body,
    Type,
    Required,
    Marks,
    Answers,
    VideoDurations,
    Choices,) {
  return axios.put(`${UPDATE_QUESTION_URL}/${id}`, qs.stringify({ 
    Body,
    Type,
    Required,
    Marks,
    Answers,
    VideoDurations,
    Choices,}), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}




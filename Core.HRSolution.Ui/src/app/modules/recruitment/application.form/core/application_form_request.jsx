import config from '../../../../../config'
import axios from 'axios';

export const  GET_JOB_PROFILE_DETAILS_URL = `${config.API_URL}/recruitment/jobprofile/job_profile_info`;
export const  POST_APPLY_CANDIDATE_URL = `${config.API_URL}/recruitment/candidate/apply_candidate`;
export const  GET_JOB_POSTED = `${config.API_URL}/recruitment/jobprofile/job_posted`;

export function JobProfileDetails(id) {
    return axios.get(`${GET_JOB_PROFILE_DETAILS_URL}/${id}`);
}

export function ApplyCandidate(formData) {
    return axios.post(POST_APPLY_CANDIDATE_URL,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
}

export function JobPostedList() {
    return axios.get(`${GET_JOB_POSTED}`);
}
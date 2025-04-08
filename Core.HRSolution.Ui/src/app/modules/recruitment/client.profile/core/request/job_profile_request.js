import config from '../../../../../../config'
import axios from 'axios';

// Define API URL from environment variable

// Define API endpoints
export const  POST_CLIENT_COMPANY_JOB_PROFILE_URL = `${config.API_URL}/recruitment/jobprofile/create_client_job_profile`;
export const  PUT_CLIENT_COMPANY_JOB_PROFILE_URL = `${config.API_URL}/recruitment/jobprofile/update_client_job_profile`;

export const  GET_DASHBOARD_CLIENT_COMPANY_JOB_PROFILE_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_dashboard_client_job_profile`;
export const  GET_INFO_JOB_PROFILE_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_information_job_profile`;
export const  POST_JOB_PROFILE_APPLICATION_FORM_URL = `${config.API_URL}/recruitment/jobprofile/create_job_application`;
export const  POST_JOB_PROFILE_APPLICATION_PROCESS_URL = `${config.API_URL}/recruitment/jobprofile/create_job_application_process`;
export const  POST_JOB_PROFILE_ASSESSMENT_URL = `${config.API_URL}/recruitment/jobprofile/create_job_assessment`;
export const  GET_AVAILABLE_ASSESSMENT_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_available_assessment`;
export const  GET_APPLICATION_PROCESS_URL = `${config.API_URL}/recruitment/jobprofile/retrieve_application_process`;

// Server should return UserModel


export function CreateClientJobProfile(formData) {
  return axios.post(POST_CLIENT_COMPANY_JOB_PROFILE_URL,formData,{
    headers: {
        'Content-Type': 'multipart/form-data'
    },
});
}

export function CreateJobApplicationForm(formData) {
    return axios.post(POST_JOB_PROFILE_APPLICATION_FORM_URL,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}


export function CreateJobApplicationProcess(formData) {
    return axios.post(POST_JOB_PROFILE_APPLICATION_PROCESS_URL,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}

export function CreateJobAssessment(formData) {
    return axios.post(POST_JOB_PROFILE_ASSESSMENT_URL,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}

export function SelectJobProfileDashboard(id) {
    return axios.get(`${GET_DASHBOARD_CLIENT_COMPANY_JOB_PROFILE_URL}/${id}`);
}


export function SelectJobProfileInformation(id) {
    return axios.get(`${GET_INFO_JOB_PROFILE_URL}/${id}`);
}

export function SelectAvailableAssessment() {
    return axios.get(`${GET_AVAILABLE_ASSESSMENT_URL}`);
}

export function SelectApplicationProcess() {
    return axios.get(`${GET_APPLICATION_PROCESS_URL}`);
}

export function UpdateClientJobProfile(id,formData) {
    return axios.put(`${PUT_CLIENT_COMPANY_JOB_PROFILE_URL}/${id}`,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
}


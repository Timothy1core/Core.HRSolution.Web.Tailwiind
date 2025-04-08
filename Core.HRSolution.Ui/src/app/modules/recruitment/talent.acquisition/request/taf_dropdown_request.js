import config from '../../../../../config'
import axios from 'axios';

export const  GET_STATUS_DROPDOWN_URL = `${config.API_URL}/recruitment/talentacquisitionform/status_list`;
export const  GET_REASON_DROPDOWN_URL = `${config.API_URL}/recruitment/talentacquisitionform/reason_list`;
export const  GET_WORK_ARRANGEMENT_DROPDOWN_URL = `${config.API_URL}/recruitment/talentacquisitionform/work_arrangement_list`;
export const  GET_TAF_APPROVER_DROPDOWN_URL = `${config.API_URL}/recruitment/client/client_individual_list`;
export const  GET_JOB_PROFILE_DROPDOWN_URL = `${config.API_URL}/recruitment/client/job_profile_list`;
export const  GET_TAF_DROPDOWN_URL = `${config.API_URL}/recruitment/talentacquisitionform/taf_list`;

export function SelectTafStatusDropDown() {
    return axios.get(`${GET_STATUS_DROPDOWN_URL}`);
}

export function SelectTafReasonDropDown() {
    return axios.get(`${GET_REASON_DROPDOWN_URL}`);
}

export function SelectTafWorkArrangementDropDown() {
    return axios.get(`${GET_WORK_ARRANGEMENT_DROPDOWN_URL}`);
}

export function SelectTafApproverDropDown(id) {
    return axios.get(`${GET_TAF_APPROVER_DROPDOWN_URL}/${id}`);
}

export function SelectJobProfileDropDown(id,deptId) {
    return axios.get(`${GET_JOB_PROFILE_DROPDOWN_URL}?id=${id}&deptId=${deptId === '' ? 0 : deptId}`);
}

export function SelectTAFDropDown(id,deptId) {
    return axios.get(`${GET_TAF_DROPDOWN_URL}?id=${id}&deptId=${deptId === '' ? 0 : deptId}`);
}

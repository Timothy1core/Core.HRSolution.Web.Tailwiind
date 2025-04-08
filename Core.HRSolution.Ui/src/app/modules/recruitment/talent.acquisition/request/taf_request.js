import config from '../../../../../config'
import axios from 'axios';
import qs from 'qs';

export const  POST_NEW_TAF_URL = `${config.API_URL}/recruitment/talentacquisitionform/create`;
export const  GET_DASHBOARD_TAF_URL = `${config.API_URL}/recruitment/talentacquisitionform/dashboard`;
export const  GET_TAF_FORM_INFO_URL = `${config.API_URL}/recruitment/talentacquisitionform/view_taf`;
export const  PUT_TAF_URL = `${config.API_URL}/recruitment/talentacquisitionform/update`;

export const  POST_SEND_TAF_URL = `${config.API_URL}/recruitment/talentacquisitionform/send`;
export const  GET_TAF_INFO_URL = `${config.API_URL}/recruitment/talentacquisitionform/view_taf_form`;
export const  PUT_TAF_ACKNOWLEDGMENT_URL = `${config.API_URL}/recruitment/talentacquisitionform/save_client_acknowledgment`;


export function CreateNewTaf(formData) {
    return axios.post(POST_NEW_TAF_URL,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}

export function SelectDashboardTaf(search, columns, sortColumnKey, sortDirection, page, size) {
    return axios.post(GET_DASHBOARD_TAF_URL, qs.stringify({ search, start: (page * size), draw: (page + 1),  length: size, columns, sortDirection, sortColumnKey }),
    {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}


export function SelectTafFormDetails(id) {
    return axios.get(`${GET_TAF_FORM_INFO_URL}/${id}`);
}

export function SaveChangesTaf(id,formData) {
    return axios.put(`${PUT_TAF_URL}/${id}`,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}

export function SendTaf(formData) {
    return axios.post(POST_SEND_TAF_URL,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}

export function SelectTafInfo(id) {
    return axios.get(`${GET_TAF_INFO_URL}/${id}`);
}


export function SaveClientAcknowledgment(id,formData) {
    return axios.put(`${PUT_TAF_ACKNOWLEDGMENT_URL}/${id}`,formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
});
}
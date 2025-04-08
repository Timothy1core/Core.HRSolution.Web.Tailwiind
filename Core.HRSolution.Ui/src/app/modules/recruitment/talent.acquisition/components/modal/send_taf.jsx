import { useState } from 'react';
import Swal from 'sweetalert2';
// import { Modal, Button } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
    SelectClientComponent,
} from '../../../client.profile/component/dropdowns/client_profile_dropdown_component';

import {
    SelectMultipleClientJobProfilesComponent,
    SelectClientIndividualsComponent
} from '../dropdown/taf_dropdown_component';

import {SendTaf} from '../../request/taf_request'
function SendTAFModal({ companyId, onSuccess }) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

   
    const validationSchema = Yup.object().shape({
        client: Yup.string().required('Client is required'),
        clientApprover: Yup.string().required('Client Individual is required'),
        tafId: Yup.array().min(1, 'Select at least one TAF'),
    });

    const formik = useFormik({
        initialValues: {
            client: '',
            clientApprover: '',
            tafId: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Replace this with your API call
                values.tafId = values.tafId.map((option) => option.value); // Extract only the values
                await SendTaf(values);
                Swal.fire('Success', 'TAF sent successfully!', 'success');
                onSuccess();
                setShow(false);
            } catch (error) {
                Swal.fire('Error', 'Failed to send TAF', 'error');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
        1
            {/* <Button onClick={() => setShow(true)} className='btn btn-sm btn-light-info me-3'>
                <KTIcon iconName='send' className='fs-2' />
                Send TRF
            </Button>
            <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-800px">
                <Modal.Header>
                    <Modal.Title>Send TAF</Modal.Title>
                    <button className="btn btn-sm btn-icon btn-active-color-primary" onClick={() => setShow(false)}>
                        <KTIcon iconName="cross" className="fs-1" />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='row g-4 mb-8'>
                            <div className='col-md-6 fv-row'>
                                <label className="required fs-6 fw-semibold mb-2">Client</label>
                                <SelectClientComponent
                                    className="form-select form-select-solid"
                                    onChange={(e) => formik.setFieldValue('client', e.target.value)}
                                />
                                {formik.touched.client && formik.errors.client && (
                                    <div className="text-danger">{formik.errors.client}</div>
                                )}
                            </div>
                            <div className='col-md-6 fv-row'>
                                <label className="required fs-6 fw-semibold mb-2">Client Individual</label>
                                <SelectClientIndividualsComponent
                                    className="form-select form-select-solid"
                                    clientId={formik.values.client}
                                    onChange={(e) => formik.setFieldValue('clientApprover', e.target.value)}
                                />
                                {formik.touched.clientApprover && formik.errors.clientApprover && (
                                    <div className="text-danger">{formik.errors.clientApprover}</div>
                                )}
                            </div>
                        </div>
                        <div className='row g-4 mb-8'>
                            <div className='col-md-12 fv-row'>
                                <label className="required fs-6 fw-semibold mb-2">TAF</label>
                                <SelectMultipleClientJobProfilesComponent
                                   clientId={formik.values.client}
                                   departmentid={''}
                                   className={'react-select-styled react-select-solid'}
                                   onChange={(selected) => formik.setFieldValue('tafId', selected)}
                                   value={formik.values.tafId}
                                />
                                {formik.touched.tafId && formik.errors.tafId && (
                                    <div className="text-danger">{formik.errors.tafId}</div>
                                )}
                            </div>
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button className='btn btn-sm btn-secondary me-2' onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button
                        className='btn btn-sm btn-dark'
                        type="submit"
                        onClick={formik.handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>
    );
}

export { SendTAFModal };

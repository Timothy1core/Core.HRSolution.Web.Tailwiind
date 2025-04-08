import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Flatpickr from 'react-flatpickr';
import {
  SelectClientComponent,
  SelectClientCompanyGroupComponent,
} from '../../client.profile/component/dropdowns/client_profile_dropdown_component';
import {
  SelectReasonComponent,
  SelectStatusComponent,
  SelectWorkArrangementComponent,
  SelectClientIndividualsComponent,
  SelectClientJobProfilesComponent
} from '../components/dropdown/taf_dropdown_component';

import {
  CreateNewTaf
} from '../request/taf_request';

import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import Swal from 'sweetalert2';

const CreateTafPage = () => {
  const [clientValue, setClientValue] = useState('');
  const [departmentValue, setDepartmentValue] = useState('');
  const [jobProfileValue, setJobProfileValue] = useState('');
  const [reasonValue, setReasonValue] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [approver, setApprover] = useState('');



  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    requestDate: Yup.date().required('Request date is required'),
    statusId: Yup.string().required('Status is required'),
    reasonId: Yup.string().required('Reason is required'),
    headcount: Yup.number()
      .required('Headcount is required')
      .min(1, 'Headcount must be at least 1'),
    clientId: Yup.string().required('Client is required'),
    
    jobId: Yup.string().required('Job profile is required'),
    negotiable: Yup.string().when('reason', {
      is: (value) => value !== '4', // Check if reason is not '4'
      then: () => Yup.string().required('Negotiable Competencies is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    nonNegotiable: Yup.string().when('reason', {
      is: (value) => value !== '4', // Check if reason is not '4'
      then: () => Yup.string().required('Non-Negotiable Competencies is required'),
      otherwise: () => Yup.string().notRequired(),
    }),
    targetSalaryRange: Yup.string().nullable(),
    interviewSchedule: Yup.string().nullable(),
    hiringManager: Yup.string().required('Hiring manager is required'),
    targetStartDate: Yup.date().required('Target start date is required'),
    workArrangement: Yup.string().required('Work arrangement is required'),
    schedule: Yup.string().required('Work schedule is required'),
    equipment: Yup.string().required('Equipment is required'),
    notes: Yup.string().nullable(),
    
  });
  

  // Initial Values for Formik
  const initialValues = {
    requestDate: '',
    statusId: '',
    reasonId: '',
    headcount: '',
    clientId: '',
    department: '',
    jobId: '',
    negotiable: '',
    nonNegotiable: '',
    targetSalaryRange: '',
    interviewSchedule: '',
    hiringManager: '',
    approver: '',
    targetStartDate: '',
    workArrangement: '',
    schedule: '',
    equipment: '',
    notes: '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
  
      // Assuming `formData` needs to be constructed from `values`
      const formData = {
        ...values,
      };
  
      const response = await CreateNewTaf(formData);
  
      if (response?.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Form Submitted',
          text: 'Your Talent Acquisition Form has been created successfully!',
        });
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: response?.message || 'An error occurred during submission.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.message || 'An unexpected error occurred.',
      });
    }
  };
  

  return (
    <>
      <ToolbarWrapper
        title="Create Talent Acquisition Form"
        subtitle="Recruitment - Talent Acquisition"
      />
      <Content>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="card mb-5">
                <div className="card-body my-10">
                  <div className="row g-4 mb-8">
                    <div className="col-5 border-gray-300 border-end-dotted px-10">
                      <h3 className="card-label fw-bold text-gray-800 mb-4">SUMMARY</h3>
                      <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="required fs-6 fw-semibold mb-2 text-gray-700">
                            Request Date
                          </label>
                          <Flatpickr
                            className="form-control"
                            placeholder="Request Date"
                            onChange={(date) => setFieldValue('requestDate', date[0])}
                          />
                          <ErrorMessage
                            name="requestDate"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                        <div className="col-md-6 fv-row">
                          <label className="required fs-6 fw-semibold mb-2 text-gray-700">
                            Status
                          </label>
                          <Field
                            as={SelectStatusComponent}
                            name="statusId"
                            className="form-select"
                          />
                          <ErrorMessage
                            name="statusId"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                      <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="required fs-6 fw-semibold mb-2 text-gray-700">
                            Reason
                          </label>
                          <Field
                            as={SelectReasonComponent}
                            name="reasonId"
                            className="form-select"
                            onChange={(e) => {
                              setFieldValue('reasonId', e.target.value);
                              setReasonValue(e.target.value);
                            }}
                          />
                          <ErrorMessage
                            name="reasonId"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                        <div className="col-md-6 fv-row">
                          <label className="required fs-6 fw-semibold mb-2 text-gray-700">
                            Headcount
                          </label>
                          <Field
                            type="number"
                            name="headcount"
                            className="form-control"
                            placeholder="Headcount"
                          />
                          <ErrorMessage
                            name="headcount"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                      <div className="row g-4 mb-8">
                        <div className="col-md-12 fv-row">
                          <label className="required fs-6 fw-semibold mb-2 text-gray-700">
                            Company/Client Name
                          </label>
                          <Field
                            as={SelectClientComponent}
                            name="clientId"
                            className="form-select"
                            onChange={(e) => {
                              setFieldValue('clientId', e.target.value);
                              setClientValue(e.target.value);
                            }}
                          />
                          <ErrorMessage
                            name="client"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="row g-4 mb-8">
                        <div className="col-md-12 fv-row">
                          <label className="required fs-6 fw-semibold mb-2 text-gray-700">
                            Job Profile
                          </label>
                          <Field
                            as={SelectClientJobProfilesComponent}
                            name="jobId"
                            className="form-select"
                            clientId={clientValue} 
                            departmentid={departmentValue}
                            onChange={(e) => {
                              setFieldValue('jobId', e.target.value);
                              setJobProfileValue(e.target.value);
                            }}
                          />
                          
                          <ErrorMessage
                            name="jobId"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-7 px-10">
                      <h3 className="card-label fw-bold text-gray-800 mb-4">
                        CALIBRATION SHEET
                      </h3>
                      {reasonValue!='4'&& (
                        <>
                        <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Negotiable Competencies
                          </label>
                          <Field
                            as="textarea"
                            name="negotiable"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="negotiable"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Non-Negotiable Competencies
                          </label>
                          <Field
                            as="textarea"
                            name="nonNegotiable"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="nonNegotiable"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                      <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Salary Range
                          </label>
                          <Field
                            type="text"
                            name="targetSalaryRange"
                            className="form-control"
                            placeholder="e.g., 10000-20000"
                          />
                        </div>
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Interview Schedule
                          </label>
                          <Field
                            type="text"
                            name="interviewSchedule"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Hiring Manager
                          </label>
                          <Field
                            as={SelectClientIndividualsComponent}
                            name="hiringManager"
                            className="form-select"
                            clientId={clientValue} 
                            onChange={(e) => {
                              setFieldValue('hiringManager', e.target.value);
                              setHiringManager(e.target.value);
                            }}
                          />
                          <ErrorMessage
                            name="hiringManager"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                        </>
                      )}
                      
                      <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Target Start Date
                          </label>
                          <Flatpickr
                            name="targetStartDate"
                            className="form-control"
                            onChange={(date) =>
                              setFieldValue('targetStartDate', date[0])
                            }
                          />
                          <ErrorMessage
                            name="targetStartDate"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Work Arrangement
                          </label>
                          <Field
                            as={SelectWorkArrangementComponent}
                            name="workArrangement"
                            className="form-select"
                          />
                          <ErrorMessage
                            name="workArrangement"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                      <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Work Schedule
                          </label>
                          <Field
                            type="text"
                            name="schedule"
                            className="form-control"
                            placeholder="e.g., 12:00a - 09:00p"
                          />
                          <ErrorMessage
                            name="schedule"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                        <div className="col-md-6 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">
                            Equipment
                          </label>
                          <Field as="select" name="equipment" className="form-select">
                            <option value="">Select option</option>
                            <option value="Core">CORE</option>
                            <option value="Client">Client</option>
                          </Field>
                          <ErrorMessage
                            name="equipment"
                            component="div"
                            className="text-danger mt-2"
                          />
                        </div>
                      </div>
                      <div className="row g-4 mb-8">
                        <div className="col-md-12 fv-row">
                          <label className="fs-6 fw-semibold mb-2 text-gray-700">Notes</label>
                          <Field as="textarea" name="notes" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Content>
    </>
  );
};

const CreateTalentAcquisitionWrapper = () => <CreateTafPage />;

export { CreateTalentAcquisitionWrapper };

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Flatpickr from 'react-flatpickr';
import {
  SelectClientComponent,
} from '../../client.profile/component/dropdowns/client_profile_dropdown_component';
import {
  SelectReasonComponent,
  SelectStatusComponent,
  SelectWorkArrangementComponent,
  SelectClientIndividualsComponent,
  SelectClientJobProfilesComponent
} from '../components/dropdown/taf_dropdown_component';

import {
  SaveChangesTaf,
  SelectTafFormDetails
} from '../request/taf_request';

import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import Swal from 'sweetalert2';

const UpdateTafPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [clientId, setClientId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await SelectTafFormDetails(id);
      if (response?.data?.taf) {
        setData(response.data.taf);
        setClientId(response.data.taf.clietId)
      }
    } catch (err) {
      navigate(`/error/400`);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validationSchema = Yup.object().shape({
    requestDate: Yup.date().required('Request date is required'),
    statusId: Yup.string().required('Status is required'),
    reasonId: Yup.string().required('Reason is required'),
    headcount: Yup.number()
      .required('Headcount is required')
      .min(1, 'Headcount must be at least 1'),
    clientId: Yup.string().required('Client is required'),
    jobId: Yup.string().required('Job profile is required'),
    negotiable: Yup.string().nullable(),
    nonNegotiable: Yup.string().nullable(),
    targetSalaryRange: Yup.string().nullable(),
    interviewSchedule: Yup.string().nullable(),
    hiringManager: Yup.string().required('Hiring manager is required'),
    targetStartDate: Yup.date().required('Target start date is required'),
    workArrangement: Yup.string().required('Work arrangement is required'),
    schedule: Yup.string().required('Work schedule is required'),
    equipment: Yup.string().required('Equipment is required'),
    notes: Yup.string().nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      console.log(values)
      const response = await SaveChangesTaf(id,values);

      if (response?.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Form Updated',
          text: 'Your Talent Acquisition Form has been updated successfully!',
        });
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
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

  if (!data) {
    return <div>Loading...</div>; // Show loading until data is fetched
  }

  return (
    <>
      <ToolbarWrapper
        title="Update Talent Acquisition Form"
        subtitle="Recruitment - Talent Acquisition"
      />
      <Content>
        <Formik
          enableReinitialize
          initialValues={{
            requestDate: data.requestDate || '',
            statusId: data.statusId || '',
            reasonId: data.reasonId || '',
            headcount: data.headcount || '',
            clientId: data.clietId || '',
            department: data.department || '',
            jobId: data.jobId || '',
            negotiable: data.negotiable || '',
            nonNegotiable: data.nonNegotiable || '',
            targetSalaryRange: data.targetSalaryRange || '',
            interviewSchedule: data.interviewSchedule || '',
            hiringManager: data.hiringManager || '',
            approver: data.approver || '',
            targetStartDate: data.targetStartDate || '',
            workArrangement: data.workArrangement || '',
            schedule: data.schedule || '',
            equipment: data.equipment || '',
            notes: data.notes || '',
          }}
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
                            name="requestDate"
                            value={data.requestDate ? new Date(data.requestDate) : ''}
                            options={{
                              dateFormat: 'Y-m-d', // Ensure correct date format
                              defaultDate: data.requestDate ? new Date(data.requestDate) : '',
                            }}
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
                              setClientId(e.target.value);
                            }}
                          />
                          <ErrorMessage
                            name="clietId"
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
                            clientId={clientId} 
                            // departmentid={1}
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
                      {data.reasonId !='4'&& (
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
                            clientId={clientId} 
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
                            value={data.targetStartDate ? new Date(data.targetStartDate) : ''}
                            options={{
                              dateFormat: 'Y-m-d', // Ensure correct date format
                              defaultDate: data.targetStartDate ? new Date(data.targetStartDate) : '',
                            }}
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

const UpdateTalentAcquisitionWrapper = () => <UpdateTafPage />;

export { UpdateTalentAcquisitionWrapper };

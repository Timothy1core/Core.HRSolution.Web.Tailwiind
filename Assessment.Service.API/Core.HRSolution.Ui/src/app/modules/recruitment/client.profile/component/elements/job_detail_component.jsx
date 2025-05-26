import React, { useState } from 'react';
import { useParams,Link as RouterLink  } from 'react-router-dom';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    SelectClientComponent,
    SelectEmploymentComponent,
    SelectJobProfileStatusComponent,
    SelectClientCompanyGroupComponent
} from '../dropdowns/client_profile_dropdown_component';
import { CreateClientJobProfile,UpdateClientJobProfile,GET_JOB_PROFILE_MARKET_RESEACH } from '../../core/request/job_profile_request';
import { enableLoadingRequest, disableLoadingRequest } from '../../../../../helpers/loading_request';
import {Navigate} from 'react-router-dom'
import ActionComponent from '../../../../../helpers/action_component';

const JobDetailsComponent = ({ profileDataValue }) => {
    const [departmentValue, setDepartmentValue] = useState(profileDataValue?.departmentId || '');
    const { id } = useParams();
    const CKEditorConfig = {
        plugins: [
            Essentials, Bold, Italic, Paragraph, List, Heading, Link,
            Table, TableToolbar, Indent, IndentBlock
        ],
        toolbar: [
            'undo', 'redo', '|',
            'heading', '|',
            'bulletedList', 'numberedList', '|',
            'bold', 'italic', '|',
            'insertTable', '|', 'indent', 'outdent'
        ],
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        viewportTopOffset: 60
    };

    const validationSchema = Yup.object().shape({
        departmentId: Yup.string().required('Client is required'),
        position: Yup.string().max(1000, 'Must be 1000 characters or less').required('Position is required'),
        employmentTypeId: Yup.string().required('Employment Type is required'),
        jobStatusId: Yup.string().required('Status is required'),
        jobDescription: Yup.string().required('Job Description is required'),
        education: Yup.string().required('Education is required'),
        experience: Yup.string().required('Experience is required'),
        keyResponsibility: Yup.string().required('Key Responsibilities are required'),
        qualifications: Yup.string().required('Qualifications are required'),
        showInCareerPage: Yup.boolean(), 
        marketScanFile: Yup.mixed()
        .nullable()
        .test("FILE_SIZE", "File too large", (value) => {
            return !value || (value && value.size <= 5 * 1024 * 1024); // 5MB
        })
        .test("FILE_TYPE", "Unsupported file format", (value) => {
            return (
                !value ||
                (value && ['application/pdf'].includes(value.type))
            );
        }),
    });
    

    const formik = useFormik({
        initialValues: {
            departmentId: profileDataValue?.departmentId || '',
            position: profileDataValue?.position || '',
            employmentTypeId: profileDataValue?.employmentTypeId ||'',
            jobStatusId: profileDataValue?.jobStatusId ||'',
            jobDescription: profileDataValue?.jobDescription ||'',
            education: profileDataValue?.education ||'',
            experience: profileDataValue?.experience ||'',
            keyResponsibility: profileDataValue?.keyResponsibility ||'',
            qualifications: profileDataValue?.qualifications ||'',
            showInCareerPage: profileDataValue?.showInCareerPage || false,
            marketScanFile: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            enableLoadingRequest();
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== null) formData.append(key, value);
                });
        
                const response = profileDataValue
                    ? await UpdateClientJobProfile(id, formData)
                    : await CreateClientJobProfile(formData);
        
                Swal.fire({
                    title: 'Success!',
                    text: `${response.data.responseText}`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (!profileDataValue) {
                            window.location.href = `/recruitment/editjobprofile/${response.data.jobId}`;
                        }
                        formik.resetForm();
                    }
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } finally {
                disableLoadingRequest();
            }
        }        
    });

    const handleDepartmentChange = (e) => {
        const selectedValue = e.target.value;
        setDepartmentValue(selectedValue);
        formik.setFieldValue('departmentId', selectedValue);
    };

    return (
        <div className="current" data-kt-stepper-element="content">
            <form onSubmit={formik.handleSubmit}>
                <div className="w-100">
                    <div className="row g-4 mb-8">
                        <div className="col-md-3 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Department</label>
                            <SelectClientComponent
                                name="departmentId"
                                value={formik.values.departmentId}
                                onChange={handleDepartmentChange}
                                className="form-select"
                            />
                            {formik.touched.departmentId && formik.errors.departmentId && (
                                <div className="text-danger mt-2">{formik.errors.departmentId}</div>
                            )}
                        </div>
                    </div>
                    <div className="row g-4 mb-8">
                        <div className="col-md-6 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Position</label>
                            <input
                                type="text"
                                name="position"
                                className="form-control"
                                placeholder="Enter Position"
                                value={formik.values.position}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.position && formik.errors.position && (
                                <div className="text-danger mt-2">{formik.errors.position}</div>
                            )}
                        </div>
                        <div className="col-md-3 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Employment Type</label>
                            <SelectEmploymentComponent
                                name="employmentTypeId"
                                value={formik.values.employmentTypeId}
                                onChange={formik.handleChange}
                                className="form-select"
                            />
                            {formik.touched.employmentTypeId && formik.errors.employmentTypeId && (
                                <div className="text-danger mt-2">{formik.errors.employmentTypeId}</div>
                            )}
                        </div>
                        <div className="col-md-3 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Status</label>
                            <SelectJobProfileStatusComponent
                                name="jobStatusId"
                                value={formik.values.jobStatusId}
                                onChange={formik.handleChange}
                                className="form-select"
                            />
                            {formik.touched.jobStatusId && formik.errors.jobStatusId && (
                                <div className="text-danger mt-2">{formik.errors.jobStatusId}</div>
                            )}
                        </div>
                    </div>
                    <div className="row g-4 mb-8">
                        <div className="col-md-12 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Job Description</label>
                            <CKEditor
                                editor={ClassicEditor}
                                config={CKEditorConfig}
                                data={formik.values.jobDescription}
                                onChange={(event, editor) => {
                                    formik.setFieldValue('jobDescription', editor.getData());
                                }}
                            />
                            {formik.touched.jobDescription && formik.errors.jobDescription && (
                                <div className="text-danger mt-2">{formik.errors.jobDescription}</div>
                            )}
                        </div>
                    </div>
                    <div className="row g-4 mb-8">
                        <div className="col-md-12 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Education</label>
                            <CKEditor
                                editor={ClassicEditor}
                                config={CKEditorConfig}
                                data={formik.values.education}
                                onChange={(event, editor) => {
                                    formik.setFieldValue('education', editor.getData());
                                }}
                            />
                            {formik.touched.education && formik.errors.education && (
                                <div className="text-danger mt-2">{formik.errors.education}</div>
                            )}
                        </div>
                        <div className="col-md-12 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Experience</label>
                            <CKEditor
                                editor={ClassicEditor}
                                config={CKEditorConfig}
                                data={formik.values.experience}
                                onChange={(event, editor) => {
                                    formik.setFieldValue('experience', editor.getData());
                                }}
                            />
                            {formik.touched.experience && formik.errors.experience && (
                                <div className="text-danger mt-2">{formik.errors.experience}</div>
                            )}
                        </div>
                    </div>
                    <div className="row g-4 mb-8">
                        <div className="col-md-12 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Key Responsibilities</label>
                            <CKEditor
                                editor={ClassicEditor}
                                config={CKEditorConfig}
                                data={formik.values.keyResponsibility}
                                onChange={(event, editor) => {
                                    formik.setFieldValue('keyResponsibility', editor.getData());
                                }}
                            />
                            {formik.touched.keyResponsibility && formik.errors.keyResponsibility && (
                                <div className="text-danger mt-2">{formik.errors.keyResponsibility}</div>
                            )}
                        </div>
                        <div className="col-md-12 fv-row">
                            <label className="required fs-6 fw-semibold mb-2">Qualifications</label>
                            <CKEditor
                                editor={ClassicEditor}
                                config={CKEditorConfig}
                                data={formik.values.qualifications}
                                onChange={(event, editor) => {
                                    formik.setFieldValue('qualifications', editor.getData());
                                }}
                            />
                            {formik.touched.qualifications && formik.errors.qualifications && (
                                <div className="text-danger mt-2">{formik.errors.qualifications}</div>
                            )}
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-md-3 fv-row">
                            <label className="fs-6 fw-semibold mb-2">Upload Attachment</label>
                            <input
                                type="file"
                                name="marketScanFile"
                                className="form-control"
                                onChange={(event) => {
                                    formik.setFieldValue("marketScanFile", event.currentTarget.files[0]);
                                }}
                            />
                            {formik.touched.file && formik.errors.file && (
                                <div className="text-danger mt-2">{formik.errors.file}</div>
                            )}
                        </div>
                        <div className='col-md-6'>
                            <div className="form-check form-switch form-check-custom form-check-solid mt-10 me-10">
                                <input
                                    className="form-check-input h-25px w-40px"
                                    type="checkbox"
                                    id="showInCareerPage"
                                    name="showInCareerPage"
                                    checked={formik.values.showInCareerPage}
                                    onChange={formik.handleChange}
                                />
                                <label className="form-check-label" htmlFor="showInCareerPage">
                                    Show in careers page
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-md-6'>
                        <RouterLink to={`${GET_JOB_PROFILE_MARKET_RESEACH}/${profileDataValue.id}/${profileDataValue?.marketScanFileName}`} className="menu-link px-3" target="_blank"> {profileDataValue?.marketScanFileName || ''}</RouterLink>
                        </div>
                    </div>
                    <div className="text-end mt-4">
                    <ActionComponent
                     buttonPermission={'department.job.profile.create'}
                     actionButton=
                     { 
                        <button type="submit" className="btn btn-dark"> Save & Continue</button>
                     }/>
                    </div>
                </div>
            </form>
        </div>
    );
};

export { JobDetailsComponent };

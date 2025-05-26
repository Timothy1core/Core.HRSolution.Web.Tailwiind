import React, { useState, useCallback, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { JobProfileDetails,ApplyCandidate } from './core/application_form_request';

const ApplicationForm = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState('');
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const response = await JobProfileDetails(id);
            if (response?.data?.jobProfile) {
                setData(response.data.jobProfile);
            } 
        } catch (err) {
            navigate(`/error/400`);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApply = () => {
        setShowApplicationForm(true);
    };

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setFileError('');
        if (rejectedFiles.length > 0) {
            setFileError('Invalid file type or size. Please upload a valid resume.');
            return;
        }
        if (acceptedFiles.length > 0) {
            setFiles(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': [],
            'application/msword': [],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5 MB limit
    });

    const generateValidationSchema = (questions) => {
        const questionsSchema = questions.reduce((acc, question, index) => {
            acc[index] = question.required
                ? Yup.string().required('This field is required')
                : Yup.string();
            return acc;
        }, {});
    
        return Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone is required'),
            address: Yup.string().required('Address is required'),
            // currentSalary: Yup.number().typeError('Current Salary must be a number').required('Current Salary is required'),
            // expectedSalary: Yup.number().typeError('Expected Salary must be a number').required('Expected Salary is required'),
            // noticePeriod: Yup.string(),
            // currentEmploymentStatus: Yup.string(),
            questions: Yup.object().shape(questionsSchema), // Nested validation
        });
    };
    
    
    

    if (!data) {
        return (
            <div id="kt_app_content_container" className="app-container container-xxl">
                <div className="card">
                    <div className="card-body">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            id="kt_app_content_container"
            className="app-container container-xxl d-flex justify-content-center align-items-center"
        >
            <div className="card w-75">
                <div className="card-body py-10">
                    <div className="text-center text-gray-700">
                        <h1>{data.position}</h1>
                        <h6>{data.employmentType}</h6>
                        <span>{ 'Makati, Metro Manila, Philippines'}</span>
                    </div>
                    <div className="separator border-secondary my-10"></div>
                    {!showApplicationForm ? (
                        <div className="px-20">
                            <h4>Description</h4>
                            <div dangerouslySetInnerHTML={{ __html: data?.jobDescription }} />
                            <div className="separator border-secondary my-10"></div>

                            <h4>Responsibilities</h4>
                            <div dangerouslySetInnerHTML={{ __html: data?.keyResponsibility }} />
                            <div className="separator border-secondary my-10"></div>

                            <h4>Qualifications</h4>
                            <div dangerouslySetInnerHTML={{ __html: data?.qualifications }} />
                            <div className="separator border-secondary my-10"></div>

                            <h4>Experience</h4>
                            <div dangerouslySetInnerHTML={{ __html: data?.experience }} />
                            <div className="separator border-secondary my-10"></div>

                            <h4>Education</h4>
                            <div dangerouslySetInnerHTML={{ __html: data?.education }} />
                            <div className="separator border-secondary my-10"></div>

                            <button
                                onClick={handleApply}
                                className="btn btn-danger w-100"
                            >
                                Apply for this job
                            </button>
                        </div>
                    ) : (
                        <Formik
                        initialValues={{
                            id: id,
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            address: '',
                            currentSalary: '',
                            expectedSalary: '',
                            currentEmploymentStatus: '',
                            noticePeriod: '',
                            questions: data.questions.reduce((acc, _, index) => {
                                acc[index] = ''; // Initialize each question's answer
                                return acc;
                            }, {}),
                        }}
                        
                            validationSchema={generateValidationSchema(data.questions)}
                            onSubmit={(values, { resetForm }) => {
                                if (files.length === 0) {
                                    setFileError('Please upload your resume.');
                                    return;
                                }
                            
                                const formattedQuestions = Object.entries(values.questions).map(([key, answer]) => ({
                                    questionId: data.questions[key].id, 
                                    answer,
                                }));
                            
                                const formData = {
                                    ...values,
                                    questions: formattedQuestions,
                                    resume: files[0],
                                };
                                try {
                                    ApplyCandidate(formData);
                                     Swal.fire({
                                        title: 'Success!',
                                        text: `Successfully Saved`,
                                        icon: 'success',
                                        confirmButtonText: 'OK',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            resetForm();
                                            setFiles([]);
                                        }
                                    });
                                   

                                   
                                } catch (err) {
                                    console.error('Error fetching data:', err);
                                }
                            }}
                            
                        >
                            {({ setFieldValue }) => (
                                <Form className="px-20">
                                    <h3 className="mb-3">Personal Information</h3>
                                    <div className="row g-4 mb-6">
                                        <div className="col-md-6 fv-row">
                                            <label className="required fs-6 fw-semibold mb-2">First Name</label>
                                            <Field type="text" name="firstName" className="form-control" />
                                            <ErrorMessage name="firstName" component="div" className="text-danger" />
                                        </div>
                                        <div className="col-md-6 fv-row">
                                            <label className="required fs-6 fw-semibold mb-2">Last Name</label>
                                            <Field type="text" name="lastName" className="form-control" />
                                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className="row g-4 mb-6">
                                        <div className="col-md-6 fv-row">
                                            <label className="required fs-6 fw-semibold mb-2">Email</label>
                                            <Field type="email" name="email" className="form-control" />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>
                                        <div className="col-md-6 fv-row">
                                            <label className="required fs-6 fw-semibold mb-2">Phone</label>
                                            <Field type="text" name="phone" className="form-control" />
                                            <ErrorMessage name="phone" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className="row g-4 mb-6">
                                        <div className="col-md-12 fv-row">
                                            <label className="required fs-6 fw-semibold mb-2">Address</label>
                                            <Field type="text" name="address" className="form-control" />
                                            <ErrorMessage name="address" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className="row g-4 mb-6">
                                        <div className="col-md-6 fv-row">
                                            <label className="fs-6 fw-semibold mb-2">Current Employment Status</label>
                                            <Field type="text" name="currentEmploymentStatus" className="form-control" />
                                        </div>
                                        <div className="col-md-6 fv-row">
                                            <label className="fs-6 fw-semibold mb-2">Notice Period</label>
                                            <Field type="text" name="noticePeriod" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row g-4 mb-6">
                                        <div className="col-md-6 fv-row">
                                            <label className="fs-6 fw-semibold mb-2">Current Salary</label>
                                            <Field type="text" name="currentSalary" className="form-control" />
                                            <ErrorMessage name="currentSalary" component="div" className="text-danger" />
                                        </div>
                                        <div className="col-md-6 fv-row">
                                            <label className="fs-6 fw-semibold mb-2">Expected Salary</label>
                                            <Field type="text" name="expectedSalary" className="form-control" />
                                            <ErrorMessage name="expectedSalary" component="div" className="text-danger" />
                                        </div>
                                    </div>
                                    <div className="row g-4 mb-6">
                                        <div className="col-md-12 fv-row">
                                            <label className="required fs-6 fw-semibold mb-2">Upload Resume</label>
                                            <div
                                                {...getRootProps()}
                                                className={`dropzone p-10 border rounded d-flex justify-content-center align-items-center ${fileError ? 'border-danger' : 'bg-secondary'}`}
                                            >
                                                <input {...getInputProps()} />
                                                {files.length > 0 ? (
                                                    <p>{files[0].name}</p>
                                                ) : (
                                                    <p>Drag & drop your resume here, or click to upload</p>
                                                )}
                                            </div>
                                            {fileError && <div className="text-danger mt-2">{fileError}</div>}
                                        </div>
                                    </div>
                                    <div className="separator border-secondary my-10"></div>
                                    <h3 className="mb-3">Questions</h3>
                                    {data.questions.map((q, index) => (
                                        <div className="row g-4" key={index}>
                                            <div className="col-md-12 fv-row mb-5">
                                                <p className="fs-6 fw-semibold">{q.body}</p>
                                                <div className="mx-5 mt-5">
                                                    {q.type === 'Dropdown' && (
                                                        q.applicationChoices.map((choice, idx) => (
                                                            <div key={idx} className="form-check form-check-custom form-check-danger form-check-solid mb-3">
                                                                <Field
                                                                    type="radio"
                                                                    name={`questions.${index}`} // Use dot notation for nested fields
                                                                    value={choice.body}
                                                                    className="form-check-input"
                                                                />
                                                                <label className="form-check-label">{choice.body}</label>
                                                            </div>
                                                        ))
                                                    )}
                                                    {q.type === 'YesNo' && (
                                                    <div className="form-check form-switch form-check-custom form-check-danger form-check-solid mb-5">
                                                        <Field
                                                            type="checkbox"
                                                            name={`questions.${index}`}
                                                            className="form-check-input h-25px w-40px"
                                                        />
                                                        <label className="form-check-label">Yes</label>
                                                    </div>
                                                    )}
                                                    {q.type === 'ShortAnswer' && (
                                                        <Field
                                                            type="text"
                                                            name={`questions.${index}`}
                                                            className="form-control"
                                                        />
                                                    )}
                                                </div>
                                                {/* Validation Error */}
                                                <ErrorMessage
                                                    name={`questions.${index}`}
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </div>
                                            <div className="separator border-secondary my-5"></div>

                                        </div>
                                        
                                    ))}


                                    <button type="submit" className="btn btn-danger w-100 mt-4">
                                        Submit Application
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </div>
    );
};


export { ApplicationForm };

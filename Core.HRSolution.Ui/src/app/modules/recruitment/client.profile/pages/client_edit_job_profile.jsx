import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import { JobDetailsComponent } from '../component/elements/job_detail_component';
import { JobApplicationForm } from '../component/elements/job_application_form_component';
import { JobWorkflowComponent } from '../component/elements/job_workflow_component';
import { SelectJobProfileInformation } from '../core/request/job_profile_request';
import { enableLoadingRequest, disableLoadingRequest } from '../../../../helpers/loading_request';

const EditJobProfilePage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    // Fetch job profile data
    const fetchData = useCallback(async () => {
        enableLoadingRequest();
        try {
            const response = await SelectJobProfileInformation(id);
            if (response?.data?.jobProfile) {
                setData(response.data.jobProfile);
                setError(false);
            } else {
                console.error('Unexpected API response:', response);
                setError(true);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(true);
        } finally {
            disableLoadingRequest();
        }
    }, [id]);

    // Fetch data on mount or id change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Render loading state or error
    if (error) {
        return <p>Error loading job profile data. Please try again later.</p>;
    }

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <ToolbarWrapper
                title="Update Client Job Profile"
                subtitle="Recruitment - Client and Job Library"
            />
            <Content>
                <div className="card mb-5">
                    <div className="card-body">
                        <ul className="nav nav-tabs nav-pills d-flex flex-wrap justify-content-center align-items-stretch border-0 fs-6 row">
                            {[
                                {
                                    id: 'jp-job-details',
                                    title: 'Job Details',
                                    description: 'Tell applicants about this role, including job title, location, and requirements.',
                                },
                                {
                                    id: 'jb-job-application-form',
                                    title: 'Application Form',
                                    description: 'Design the application form for this role.',
                                },
                                {
                                    id: 'jb-job-workflows',
                                    title: 'Workflow',
                                    description: 'Create a kit or assessment test for a structured interview process.',
                                },
                            ].map((tab, index) => (
                                <li
                                    key={tab.id}
                                    className={`nav-item col-12 col-md-3 col-lg-3 ${index === 0 ? 'active' : ''}`}
                                >
                                    <a
                                        className={`nav-link btn btn-flex btn-active-light btn-secondary w-100 h-100 ${
                                            index === 0 ? 'active' : ''
                                        }`}
                                        data-bs-toggle="tab"
                                        href={`#${tab.id}`}
                                    >
                                        <span className="d-flex flex-column ms-2 w-100">
                                            <span className="fs-4 fw-bold">{tab.title}</span>
                                            <span className="fs-7">{tab.description}</span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="separator my-10"></div>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="jp-job-details" role="tabpanel">
                                <JobDetailsComponent profileDataValue={data.clientJobProfile} />
                            </div>
                            <div className="tab-pane fade" id="jb-job-application-form" role="tabpanel">
                                <JobApplicationForm applicationQuestions={data.applicationQuestions} />
                            </div>
                            <div className="tab-pane fade" id="jb-job-workflows" role="tabpanel">
                                <JobWorkflowComponent
                                    hasApplicationProcess={data.hasApplicationProcess}
                                    jobAssessments={data.assessments}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        </>
    );
};

const ClientEditJobProfileWrapper = () => <EditJobProfilePage />;

export { ClientEditJobProfileWrapper };

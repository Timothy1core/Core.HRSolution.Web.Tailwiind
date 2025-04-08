import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import React, { useState, useCallback,useEffect  } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';

import { JobDetailsComponent } from '../component/elements/job_detail_component';


const CreateJobProfilePage = () => {
   
    return (
        <>
        <ToolbarWrapper
            title="Create Client Job Profile"
            subtitle="Recruitment - Client and Job Library"
        />
        <Content>
            <div className="card mb-5">
                <div className="card-body">
                  <ul className="nav nav-tabs nav-pills d-flex flex-wrap justify-content-center align-items-stretch border-0 fs-6 row">
                      <li className="nav-item col-12 col-md-3 col-lg-3">
                          <a className="nav-link active btn btn-flex btn-active-light btn-secondary w-100 h-100" data-bs-toggle="tab" href="#jp-job-details">
                              <span className="d-flex flex-column ms-2 w-100">
                                  <span className="fs-4 fw-bold">Job Details</span>
                                  <span className="fs-7">Tell applicants about this role, including job title, location and requirements.</span>
                              </span>
                          </a>
                      </li>
                      <li className="nav-item col-12 col-md-3 col-lg-3">
                          <a className="nav-link btn btn-flex btn-active-light btn-secondary w-100 h-100 disabled" data-bs-toggle="tab" href="#jb-job-application-form">
                              <span className="d-flex flex-column ms-2 w-100">
                                  <span className="fs-4 fw-bold">Application Form</span>
                                  <span className="fs-7">Design the application form for this role.</span>
                              </span>
                          </a>
                      </li>
                      <li className="nav-item col-12 col-md-3 col-lg-3">
                          <a className="nav-link btn btn-flex btn-active-light btn-secondary w-100 h-100 disabled" data-bs-toggle="tab" href="#jb-job-workflows">
                              <span className="d-flex flex-column ms-2 w-100">
                                  <span className="fs-4 fw-bold">Workflow</span>
                                  <span className="fs-7">Create a kit or assesment test for a structure interview process.</span>
                              </span>
                          </a>
                      </li>
                  </ul>
                  <div className="separator my-10"></div>
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="jp-job-details" role="tabpanel">
                      <JobDetailsComponent profileDataValue={''}/>
                    </div>
                  </div>
                </div>
            </div>

        </Content>
        </>
    );
};

const ClientCreateJobProfileWrapper = () => <CreateJobProfilePage />;

export { ClientCreateJobProfileWrapper };

import { Content } from '../../../../../_metronic/layout/components/content'
import { toAbsoluteUrl } from '@/_metronic/utils';
import { KTIcon} from '@/_metronic/helpers';
import React, { useState, useEffect } from 'react';
import {useAuth} from '../../../../../app/modules/auth'


const JobOfferCreatePage = () => {

    // const {currentUser} = useAuth()
    const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();
    // const [candidateData, setCandidateData] = useState([]);

    // useEffect(() => {
    //   fetchCandidateInfo();
    //   fetchJobProfiles();
    //   fetchWriteUp();
    // }, [candidateId]);

  return(
  <>
    {/* {!loading && 
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <a href='candidates' className='btn btn-sm btn-light-danger'>
              <KTIcon iconName='entrance-right' className='fs-2' />
                Go Back
              </a>
          </div>
        </div>
      </div>} */}

    {!loading && 
    <Content>
    
      <div className='card mb-5 mb-xl-8 p-8'>
        <div className="row fs-5 mb-5">
        <div className="col-8">
          <div className='d-flex overflow-auto h-55px '>
                          <ul className="nav nav-pills ">
                              <li className="nav-item">
                                  <a className="nav-link active btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_profile">
                                      Basics
                                  </a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_communication">
                                      Salary Package
                                  </a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_review">
                                      Review
                                  </a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_comments">
                                      Comments
                                  </a>
                              </li>
                          </ul>
                      </div>
                      <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="tab_candidate_profile" role="tabpanel">
                          <div className='d-flex justify-content-start my-7'>
                            a
                            {/* <div>Position: <b>{candidateData.jobName}</b></div> */}
                          </div>
                          <div className='d-flex justify-content-start my-7'>
                          {/* <div>Application Status: <b>{candidateData.stageName}</b></div> */}
                          </div>
                          <div className='row justify-content-start my-7'>
                            {/* <div className='col'>Current Employment Status: <b>{candidateData.currentEmploymentStatus}</b></div> */}
                            {/* <div className='col'>Notice Period: <b>{candidateData.noticePeriod}</b></div> */}
                          </div>
                          <div className='row justify-content-start my-7'>
                            {/* <div className='col'>Expected Salary: <b>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidateData.currentSalary)}</b></div> */}
                            {/* <div className='col'> Expected Salary: <b>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidateData.expectedSalary)}</b></div> */}
                          </div>
                        </div>
                      </div>
        </div>
        </div>
      </div>
    </Content>
    }
  </>
  )
  
}

const JobOfferCreate = () => {
  return (
    <>
      <JobOfferCreatePage />
    </>
  )
}

export { JobOfferCreate }

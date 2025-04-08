import { Content } from '../../../../../_metronic/layout/components/content'
import React, { useState, useEffect } from 'react';
import { getEmailContent, sendJobOffer} from '../core/requests/_request';
import { useLocation } from 'react-router-dom';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../helpers/loading_request';
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import { KTIcon } from '@/_metronic/helpers';
import { JobOfferAcceptancePreview } from './job_offer_acceptance_preview';
const PreviewJobOfferInfoPage = () => {
    const location = useLocation();
    const [candidateId, setCandidateId] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);
    const [declineReason, setDeclineReason] = useState(null);
    
    const handleSendJobOffer = async () => {
            try {
                const response = await sendJobOffer(candidateId);
                console.log(response.data)
                if (response.data.value.success) {
                    Swal.fire('Sent', 'Job Offer Sent Successfully!', 'success');
                }    
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'An error occurred while sending job offer.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }; 
    // Update candidateId when location changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        setCandidateId(id);
    }, [location.search]); // Runs when URL search params change

    const fetchJobOfferInfo = async () => {
        enableLoadingRequest();
        console.log(candidateId)
        if (!candidateId) return;
        setLoading(true);
        try {
          const res = await getEmailContent(candidateId);
          console.log(res.data)
          if (res.status === 200 && res.data) {
              setData(res.data.emailContent)
          }
        } catch (error) {
          console.error('Error fetching job offer info:', error);
        } finally {
        disableLoadingRequest();
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if (candidateId) {
          fetchJobOfferInfo(candidateId);
        }
      }, [candidateId]); // Runs whenever candidateId changes

    if (loading || !data) {
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
  return(
  <>
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <a href='joboffer' className='btn btn-sm btn-light-danger'>
              <KTIcon iconName='entrance-right' className='fs-2' />
                Go Back
              </a>
          </div>
          <div className="page-title d-flex flex-column justify-content-center flex-wrap">
              <a 
                onClick={() => handleSendJobOffer()} className='btn btn-sm btn-light-primary'>
                Send Offer
                <KTIcon iconName='send' className='ms-2 fs-2' />
              </a>
          </div>
        </div>
      </div>

    <Content>
      <div className='card mb-5 mb-xl-8'>
        {/* <div className='card-header flex-nowrap'>
            <h1 className='card-title fw-bolder text-gray-900 fs-3'>Job Offer Salary Package Approval</h1>                
        </div> */}
        <div className="card-header card-header-stretch">
            <h3 className="card-title">Job Offer Salary Package Approval</h3>
            <div className="card-toolbar">
            <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
                <li className="nav-item">
                <a
                    className="nav-link active text-active-primary"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_7"
                >
                    Preview Email
                </a>
                </li>
                <li className="nav-item ">
                <a
                    className="nav-link text-active-primary"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_8"
                >
                    Preview Job Offer Page
                </a>
                </li>
            </ul>
            </div>
        </div>
        <div className="card-body">
            <div className="tab-content" id="myTabContent">
            <div
                className="tab-pane fade show active"
                id="kt_tab_pane_7"
                role="tabpanel"
                dangerouslySetInnerHTML={{ __html: data.emailBody }}
            >
            </div>
            <div
                className="tab-pane fade"
                id="kt_tab_pane_8"
                role="tabpanel"
            >
                <JobOfferAcceptancePreview />
            </div>
            </div>
        </div>
        
        
      </div>
    </Content>
  </>
  )
  
}

const PreviewJobOfferInfo = () => {
  return (
    <>
      <PreviewJobOfferInfoPage />
    </>
  )
}

export { PreviewJobOfferInfo }

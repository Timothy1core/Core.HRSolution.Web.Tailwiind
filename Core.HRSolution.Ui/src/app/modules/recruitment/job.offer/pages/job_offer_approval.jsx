import React, { useState, useEffect } from 'react';
import { getJobOfferInfo, saveApproveSignature, salaryDeclined } from '../core/requests/_request';
import { useLocation } from 'react-router-dom';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../helpers/loading_request';
import dayjs from "dayjs";
// import {  Button } from 'react-bootstrap';
import { SigOptionComponentApprove } from '../../../../helpers/esignature/approve_esignature_modal_component';
import { SigOptionComponentDecline } from '../../../../helpers/esignature/decline_esignature_modal_component';
const JobOfferApproval = () => {
    const location = useLocation();
    const [candidateId, setCandidateId] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);
    const [declineReason, setDeclineReason] = useState(null);
    

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
          const res = await getJobOfferInfo(candidateId);
          console.log(res.data)
          if (res.status === 200 && res.data) {
              setData(res.data.jobOfferInfo)
              setSignature(res.data.jobOfferInfo.approverSignature)
              setDeclineReason(res.data.jobOfferInfo.approverNotes)
          }
        } catch (error) {
          console.error('Error fetching job offer info:', error);
        } finally {
        disableLoadingRequest();
          setLoading(false);
        }
      };

    const handleSaveSignature = async (dataURL) => {
        try {
            setSignature(dataURL);
    
            const response = await saveApproveSignature(candidateId, dataURL);
    
            Swal.fire({
                title: 'Success!',
                text: `${response.data.responseText}`,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                // Add functionality for what to do after user confirms
                alert('Signature saved successfully!');
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'An error occurred while saving the signature.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleDecline = async (reason) => {
        try {
            setDeclineReason(reason)
            const response = await salaryDeclined(candidateId, reason);
    
            Swal.fire({
                title: 'Declined!',
                text: `${response.data.responseText}`,
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then(() => {
                // Add functionality for what to do after user confirms
                alert('Salary Package Declined!');
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'An error occurred while saving the signature.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };
      
      useEffect(() => {
        if (candidateId) {
          fetchJobOfferInfo(candidateId);
        }
      }, [candidateId]); // Runs whenever candidateId changes

    return (
        <div
            id="kt_app_content_container"
            className="app-container container-xxl d-flex justify-content-center align-items-center"
        >
            <div className='card w-100 mb-5 mb-xl-8'>
                    <div className='card-header flex-nowrap'>
                        <h1 className='card-title fw-bolder text-gray-900 fs-3'>Job Offer Salary Package Approval</h1>                
                    </div>
                    <div className="card-body">
                        <div className="row mb-2">
                            <div className="col-md-6">
                              <label className="form-label fs-4">Candidate: <span className='fw-bold fs-4'>{ data.candidateName }</span></label>
                              
                            </div>
                            <div className="col-md-6">
                            <label className="form-label fs-4">Position: <span className='fw-bold fs-4'>{ data.position}</span></label>
                            </div>
                        </div>   
            
                        <div className="row my-2">
                            <div className="col-md-6">
                              <label className="form-label fs-4">Total Rendering Period (Day's): <span className='fw-bold fs-4'>{ data.totalRenderingPeriod}</span></label>
                              
                            </div>
                            <div className="col-md-6">
                            <label className="form-label fs-4">Target Start Date: <span className='fw-bold fs-4'>{ dayjs(data.targetStartDate).format('	MMMM D, YYYY h:mm A')}</span></label>
                            </div>
                        </div>    
            
                        <div className="my-4 card p-2">
                          <span className="fs-3 fw-bold text-gray-600">Probationary Package:</span>
                            <div className='d-flex gap-2'>
                              <div className="flex-fill">
                                <label className="form-label fs-4">Basic Salary: <span className='fw-bold fs-4'>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.regularSalary)}</span></label>
                              </div>
                              <div className="flex-fill">
                                <label className="form-label fs-4">Deminimis: <span className='fw-bold fs-4'>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.regularDeminimis)}</span></label>
                              </div>
                            </div>
                        </div>
            
                        <div className="my-4 card p-2">
                          <span className="fs-3 fw-bold text-gray-600">Regularization Package (after 6 months): </span>
                            <div className='d-flex gap-2'>
                              <div className="flex-fill">
                                <label className="form-label fs-4">Basic Salary: <span className='fw-bold fs-4'>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.probitionarySalary)}</span></label>
                              </div>
                              <div className="flex-fill">
                                <label className="form-label fs-4">Deminimis: <span className='fw-bold fs-4'>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.probitionaryDeminimis)}</span></label>
                              </div>
                            </div>
                        </div>
            
                        <div className="row g-5 mb-11 mt-6">
                         {/* <div className="col-sm-12"> */}
                            <div className='w-25 justify-content-center flex-column'>
                           <div className="mb-1 flex-column justify-content-center">
                             {declineReason ? (<div className="fw-bold fs-6 text-danger">Declined: {declineReason}</div> ) : signature ? (
                               <>
                               <img 
                                src={signature} 
                                alt="E-Signature" 
                                className='w-25'
                               />
                             <div className="fw-semibold fs-7 text-gray-600 mb-1">{ dayjs(data.approvedDate).format('	MMMM D, YYYY h:mm A')}</div>
                             <div className="fw-bold fs-6 text-gray-800">Approver Signature</div>    
                             </>   
                                                                           
                             ) : (
                            //    <SignaturePadModal onSave={handleSaveSignature} />
                            <>
                            <div className='d-flex justify-content-center align-items-center flex-column'> 
                                <div>
                                    {/* <Button 
                                        data-kt-menu-trigger="click" 
                                        data-kt-menu-placement="right-start" 
                                        data-kt-menu-flip="top-end" 
                                        className='btn btn-sm btn-danger'
                                    >Sign Options</Button> */}
                                    <div className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-auto min-w-200 mw-300px' data-kt-menu='true'>
                                        <div className="menu-item px-3">
                                            <div className="menu-content fs-6 text-gray-900 fw-bold px-3 py-4">Actions</div>
                                        </div>
                                        <div className='separator border-gray-200'></div>
                                        <div className="menu-item px-3 py-2 text-center">
                                            <SigOptionComponentApprove onSave={handleSaveSignature} />
                                        </div>
                                        <div className="menu-item px-3 py-2 text-center">
                                            <SigOptionComponentDecline onSave={handleDecline} />
                                        </div>
                                    </div>                                                    
                                </div>
                                <div className="fw-bold fs-6 text-gray-800">Approver Signature</div>  
                            </div>
                            </>
                             )}
                            </div>                
                               
                            </div>           
                         {/* </div>     */}
                        </div> 
                    </div>
                    
                    
                  </div>
        </div>
    );
};


export { JobOfferApproval };

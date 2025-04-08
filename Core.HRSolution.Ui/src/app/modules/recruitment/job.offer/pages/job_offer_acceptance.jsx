import React, { useState,useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { SelectTafInfo, SaveClientAcknowledgment } from '../request/taf_request';
import { SignaturePadModal} from '../../../../../app/helpers/esignature/esignature_modal_component'
import Swal from 'sweetalert2';
import { SigOptionComponentApprove } from '../../../../helpers/esignature/approve_esignature_modal_component';
import { SigOptionComponentDecline } from '../../../../helpers/esignature/decline_esignature_modal_component';
// import {  Button } from 'react-bootstrap';
import { disableLoadingRequest, enableLoadingRequest } from '../../../../helpers/loading_request';
import { useLocation } from 'react-router-dom';
import { getJobOfferInfo, jobOfferAccepted, jobOfferDeclined } from '../core/requests/_request';
import dayjs from "dayjs";

const JobOfferAcceptance = () => {
    const location = useLocation();
    const [candidateId, setCandidateId] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState(null);
    const [approverSignature, setApproverSignature] = useState(null);
    
    const [declineReason, setDeclineReason] = useState(null);        

    const handleSaveSignature = async (dataURL) => {
            try {
                setSignature(dataURL);
        
                const response = await jobOfferAccepted(candidateId, dataURL);
        
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
                const response = await jobOfferDeclined(candidateId, reason);
        
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
              setApproverSignature(res.data.jobOfferInfo.approverSignature)
              setSignature(res.data.jobOfferInfo.candidateSignature)
              setDeclineReason(res.data.jobOfferInfo.approverNotes)
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

    
    // if (!data) {
    //     return (
    //         <div id="kt_app_content_container" className="app-container container-xxl">
    //             <div className="card">
    //                 <div className="card-body">
    //                     <p>Loading...</p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    return (
        <div
            id="kt_app_content_container"
            className="app-container container-xxl d-flex justify-content-center align-items-center"
        >
            <div className="card w-100">
                <div className="card-body py-10">
                    <div className="text-center text-gray-700">
                        <h1>One CoreDev IT Inc. - {data.position}</h1>
                    </div>
                    <div className="separator border-secondary my-10"></div>
                    <div className="text-center text-gray-700">
                        <h1>JOB OFFER</h1>
                        <p className="text-justify fw-semibold fs-5 text-gray-800 px-10">
                            After your professional qualifications have been evaluated as best matched for the probationary position of <span className='fw-bolder'>{data.position} - (Department)</span>, (Company) is pleased to present to you this job offer, subject to the following:
                        </p>
                    </div>
                    <div className='px-10'>
                    <div className='row'>
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered align-middle gs-7 gy-5 text-center">
                                        <thead className='bg-danger text-white'>
                                            <tr className="fw-semibold fs-5 text-gray-800 ">
                                                <th className='text-white fw-bolder py-2' colSpan={2}>TERMS</th>
                                            </tr>
                                        </thead>
                                        <tbody className='fs-5'>
                                            
                                                <tr className='bg-light-danger'>
                                                    <td className='fw-bold py-2'>POSITION</td>
                                                    <td className='fw-bold py-2'>DESCRIPTION</td>
                                                </tr>
                                                <tr className=''>
                                                    <td className='fw-bolder'>{data.position}</td>
                                                    <td className='fw-bolder'>This position is for probationary employment for 6 months</td>
                                                </tr>
                                        </tbody>
                                    </table>
                                </div>


                                <div className="table-responsive mt-5">
                                    <table className="table border table-row-bordered align-middle gs-7 gy-5 text-center">
                                        <thead className=' text-white'>
                                            <tr className="fw-semibold fs-5 text-gray-800 border-bottom border-gray-200 bg-dark">
                                                <th className='text-white fw-bolder pt-0 ps-0'>
                                                    <table class="table gy-5 gs-5 m-0">
                                                    <thead>
                                                        <tr className="fw-semibold fs-6 text-gray-800 bg-danger border-bottom-0">
                                                            <th scope="col" className='text-white fw-bolder'>TOTAL COMPENSATION PACKAGE</th>
                                                        </tr>
                                                    </thead>
                                                    </table>
                                                </th>
                                                <th className='text-white fw-bolder' colSpan={2}></th>
                                            </tr>
                                        </thead>
                                        <tbody className='fs-5'>
                                                <tr className='bg-secondary'>
                                                    <td></td>
                                                    <td></td>
                                                    <td className='fw-bolder py-2 '>GROSS PAY { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parseInt(data.regularSalary) + parseInt(data.regularDeminimis))} (+-)</td>
                                                </tr>
                                                <tr className=''>
                                                    <td className='fw-bolder'>BASIC PAY</td>
                                                    <td>Taxable</td>
                                                    <td className='fw-bolder'>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.regularSalary)}</td>
                                                </tr>
                                                <tr className=''>
                                                    <td className='fw-bolder'>DE MINIMIS* <br></br>
                                                    (Company Allowance/s)</td>
                                                    <td>Non-Taxable</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.regularDeminimis)}</td>
                                                </tr>
                                                <tr>
                                                    <td rowSpan={5}></td>
                                                    <td>Meal Allowance</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parseInt(data.regularDeminimis / 5))}</td>
                                                </tr>
                                                <tr>
                                                    <td>Rice Allowance</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parseInt(data.regularDeminimis / 5))}</td>
                                                </tr>
                                                <tr>
                                                    <td>Clothing Allowance</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parseInt(data.regularDeminimis / 5))}</td>
                                                </tr>
                                                <tr>
                                                    <td>Laundry Allowance</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parseInt(data.regularDeminimis / 5))}</td>
                                                </tr>
                                                <tr>
                                                    <td>Medical Cash Allowance</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(parseInt(data.regularDeminimis / 5))}</td>
                                                </tr>
                                                <tr className='bg-secondary'>
                                                    <td className='fw-bolder py-2 '>INCENTIVES</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr className=''>
                                                    <td className='fw-bold'>Attendance Incentive</td>
                                                    <td>Entitle to Monthly Attendance Incentive<br /> (Subject to existing parameters)</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(2000)}</td>
                                                </tr>
                                                <tr className=''>
                                                    <td className='fw-bold'></td>
                                                    <td>A. Full Bi-monthly Attendance Incentive<br /> B. 50% Bi-monthly Attendance Incentive</td>
                                                    <td>{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(1000)}<br />{ new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(500)}</td>
                                                </tr>
                                                <tr className=''>
                                                    <td className='fw-bold'>Other Incentive</td>
                                                    <td>Any other bonuses/incentives<br /> (Subject to existing parameters)</td>
                                                    <td>xxxx.xx</td>
                                                </tr>
                                                <tr className='bg-secondary'>
                                                    <td className='fw-bolder py-2 '>GUARANTEED BENEFIT</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr className=''>
                                                    <td>13thMonth Pay</td>
                                                    <td>As required by law</td>
                                                    <td></td>
                                                </tr>
                                                <tr className='bg-secondary'>
                                                    <td className='fw-bolder py-2 '>GUARANTEED BENEFIT</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr className=''>
                                                    <td>Health Benefit</td>
                                                    <td colSpan={2}>Entitled to HMO coverage (3rd moth of employment) <br />Up to { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(80000)} Coverage per illness/year</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className=''>
                                                    <td></td>
                                                    <td colSpan={2}>One HMO Dependent coverage (3rd moth of employment) <br /> Up to { new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(80000)} Coverage per illness/year</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className=''>
                                                    <td>Leave Benefit</td>
                                                    <td colSpan={2}>Entitled to 6 SL, 6 VL and 3 EL leaves with pay <br />(Subject to existing parameters for Leave Credit Policy)<br /> Unused Leave convertible to Cash* <br />Special Leave Privileges</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className=''>
                                                    <td>Service Award Incentive</td>
                                                    <td colSpan={2}>Incentives/Tokens for years of service</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className='bg-secondary'>
                                                    <td className='fw-bolder py-2 '>STATUTORY BENEFITS</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr className=''>
                                                    <td>Social Security System (SSS)</td>
                                                    <td colSpan={2}>Employer share, as provided by law</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className=''>
                                                    <td>Employee's Compensation Commission (ECC)</td>
                                                    <td colSpan={2}>Employer share, as provided by law</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className=''>
                                                    <td>PHILHEALTH</td>
                                                    <td colSpan={2}>Employer share, as provided by law</td>
                                                    {/* <td></td> */}
                                                </tr>
                                                <tr className=''>
                                                    <td>PAG-IBIG (HDMF)</td>
                                                    <td colSpan={2}>Employer share, as provided by law</td>
                                                    {/* <td></td> */}
                                                </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-responsive mt-5">
                                    <table className="table border table-row-bordered align-middle gs-7 gy-5 text-center">
                                        <tbody>
                                                <tr className="bg-danger fw-semibold fs-5 text-gray-800 ">
                                                    <td className='text-white fw-bolder py-2' colSpan={3}>ACKNOWLEDGEMENT</td>
                                                </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                <p className="text-justify fw-bold fs-5 text-gray-800">
                                If the above terms and conditions are acceptable to you, please indicate your conformity by signing on the space provided. A formal contract of employment will be issued subject to compliance to the abovementioned conditions.
                                </p>
                                <p className="text-justify fw-bold fs-5 text-gray-800">
                               We look forward working with you.
                                </p>
                            </div>
                        </div>
                        
                        <div className='row'>
                            <div className='col-sm-12 mt-0'>
                                
                            </div>
                        </div>



                        <div className="row g-5 mb-11">
                            <div className="col-3">
                                <div className="">
                                    {approverSignature  && 
                                        <div className='d-flex text-start flex-column'>
                                            <div className="fw-bold fs-5 text-gray-800 ">Sincerely,</div>
                                        <img 
                                            src={approverSignature} 
                                            alt="E-Signature" 
                                            className=' text-center'
                                        />
                                        <div className="fw-semibold fs-6 text-gray-600 mb-1 border-top text-center"><span className='fw-bolder text-dark'>Human Resources Management</span></div>                                     
                                        </div>   
                                    }             
                                </div>                           
                            </div> 
                            <div className="col-6">                          
                            </div> 
                            <div className="col-3 text-center">
                                <div className="">
                                    {signature  && 
                                        <div className='d-flex text-start flex-column'>
                                        <div className="fw-bold fs-5 text-gray-800 ">Conforme:</div>
                                        <img 
                                            src={signature} 
                                            alt="E-Signature" 
                                            className='text-center'
                                        />
                                        <div className="fw-bold fs-5 text-gray-800 ">{data.candidateName}</div>
                                        <div className="fw-semibold fs-6 text-gray-600 mb-1 border-top text-center"><span className='fw-bolder text-dark'>Signature Over/Printed Name</span></div>  
                                        <div className="fw-semibold fs-6 text-gray-600 mb-1 border-bottom"><span className='fw-bolder text-dark'>Date: </span>{ dayjs(data.approvedDate).format('MMMM D, YYYY')}</div>
                                        
                                        </div>   
                                    }             
                                    {/* // ) : ( */}
                                    { data.isApproved &&  !signature && 
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
                                            <div className="fw-bold fs-6 text-gray-800">Candidate Signature</div>  
                                        </div>
                                        </>
                                    }
                                </div>                           
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export { JobOfferAcceptance };

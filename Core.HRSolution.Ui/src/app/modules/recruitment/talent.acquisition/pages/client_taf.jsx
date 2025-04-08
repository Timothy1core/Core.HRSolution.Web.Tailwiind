import React, { useState,useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SelectTafInfo, SaveClientAcknowledgment } from '../request/taf_request';
import { SignaturePadModal} from '../../../../../app/helpers/esignature/esignature_modal_component'



const ClientTAF = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [signature, setSignature] = useState(null);

    const handleSaveSignature = async (dataURL) => {
        try {
            setSignature(dataURL);
    
            const formData = new FormData();
            formData.append('signature', dataURL);
    
            const response = await SaveClientAcknowledgment(id, formData);
    
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
    
    const fetchData = useCallback(async () => {
        try {
            const response = await SelectTafInfo(id);
            if (response?.data?.taf) {
                setData(response.data.taf);
                setSignature(response.data.taf.signature)
            } 
        } catch (err) {
            navigate(`/error/400`);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    
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
            <div className="card w-100">
                <div className="card-body py-10">
                    <div className="text-center text-gray-700">
                        <h1>TALENT ACQUISITION FORM</h1>
                    </div>
                    <div className="separator border-secondary my-10"></div>
                    <div className='px-10'>
                        <div className="row g-5 mb-11">
                            <div className="col-sm-12">
                                <div className="fw-semibold fs-7 text-gray-600 mb-1">Company Name:</div>                
                                <div className="fw-bold fs-6 text-gray-800">{data.companyName}</div>                
                            </div>    
                            <div className="col-sm-6">
                                <div className="fw-semibold fs-7 text-gray-600 mb-1">Client Name:</div>                
                                <div className="fw-bold fs-6 text-gray-800">{data.clientApproverName}</div>                
                            </div> 
                            <div className="col-sm-6">
                                <div className="fw-semibold fs-7 text-gray-600 mb-1">Client Email:</div>                
                                <div className="fw-bold fs-6 text-gray-800">{data.clientApproverEmail}</div>                
                            </div>             
                        </div>
                        <div className="separator border-secondary my-10"></div>
                        
                        {/* <div className='row'>
                            <div className='col-sm-12 mt-0'>
                                <div className="table-responsive">
                                    <table className="table table-row-dashed align-middle gs-7 gy-5 text-center">
                                        <thead className='bg-secondary'>
                                            <tr className="fw-semibold fs-6 text-gray-800 border-bottom border-gray-200">
                                                <th>Position</th>
                                                <th>Headcount</th>
                                                <th>Reason</th>
                                                <th>Work Arrangement</th>
                                                <th>Target Start Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.talentAcquisitionForms.map((q, index) => (
                                                <tr key={index}>
                                                    <td>{q.position}</td>
                                                    <td>{q.headcount}</td>
                                                    <td>{q.reason}</td>
                                                    <td>{q.workArrangement}</td>
                                                    <td>{q.targetStartDate}</td>
                                                </tr>
                                            ))}
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> */}

                        <div className="separator border-secondary my-10"></div>

                        <div className='row'>
                            <div className="col-md-12">
                                <h6 className="fw-semibold text-gray-800 mb-8 fs-5">Acknowledgment</h6>
                                <p className="text-justify fw-semibold fs-6 text-gray-800">
                                    By signing this Talent Requisition Form, I, <b>{data.clientApproverName}</b>, on behalf of <b>{data.companyName}</b>, acknowledge that I am requesting One CoreDev IT to fill the job opening described above. I understand and agree to the following terms and conditions:
                                </p>
                                <ul className='fw-semibold fs-6 text-gray-800'>
                                    <li>
                                        <p className="text-justify"><b>Authorization: </b> I am authorized to request recruitment services and to provide the necessary information to initiate the hiring process for the specified job opening.</p>
                                    </li>
                                    <li>
                                        <p className="text-justify"><b>Fees: </b> I acknowledge that recruitment services provided by One CoreDev IT are subject to the agreed-upon fees and payment terms, as outlined in a separate agreement or contract</p>
                                    </li>
                                    <li>
                                        <p className="text-justify"><b>Candidate Selection:</b> I understand that One CoreDev IT will present potential candidates based on the provided job description and requirements, but the final candidate selection will be made by <b>{data.companyName}</b>.</p>
                                    </li>
                                    <li>
                                        <p className="text-justify"><b>Timeframe:</b> I understand that the recruitment process may take time to identify suitable candidates, and One CoreDev IT will make reasonable efforts to expedite the process without compromising the quality of the selection.</p>
                                    </li>
                                    <li>
                                        <p className="text-justify"><b>Feedback and Communication:</b> I agree to provide timely feedback to One CoreDev IT regarding the presented candidates and the overall recruitment process to ensure efficient progress.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="separator border-secondary my-10"></div>

                        <div className="row g-5 mb-11">
                            <div className="col-sm-12">
                                <div className="mb-1">
                                    {signature ? (
                                        <>
                                        <img 
                                            src={signature} 
                                            alt="E-Signature" 
                                            className='w-25'
                                        />
                                        <div className="fw-semibold fs-7 text-gray-600 mb-1">{data.approveDate}</div>  
                                        </>   
                                                   
                                    ) : (
                                        <SignaturePadModal onSave={handleSaveSignature} />
                                    )}
                                </div>                
                                <div className="fw-bold fs-6 text-gray-800">Client Signature</div>                
                            </div>    
                        </div>


                        

                    </div>
                </div>
            </div>
        </div>
    );
};


export { ClientTAF };

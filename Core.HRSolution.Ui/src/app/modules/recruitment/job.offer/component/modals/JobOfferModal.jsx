import { useState, useEffect } from 'react';
// import { Modal } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import 'ckeditor5/ckeditor5.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { getJobOfferInfo, updateJobOfferInfo } from '../../core/requests/_request';
import { SelectTafApproverDropDown } from '../../../talent.acquisition/request/taf_dropdown_request';

const eventSchema = Yup.object().shape({
  totalRenderingPeriod: Yup.number().required('Required'),
  targetStartDate: Yup.string().required('Required'),
  probationarySalary: Yup.string().required('Required'),
  probationaryDeminimis: Yup.string().required('Required'),
  regularizationSalary: Yup.string().required('Required'),
  regularizationDeminimis: Yup.string().required('Required'),
  approverId: Yup.string().required('Required'),
});

const JobOfferModal = ({ show, handleClose, jobOfferId }) => {
  const [loading, setLoading] = useState(false);
  const [listApprovers, setListApprovers] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [candidateId, setCandidateId]= useState(0);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      totalRenderingPeriod: '',
      targetStartDate: '',
      probationarySalary: '',
      probationaryDeminimis: '',
      regularizationSalary: '',
      regularizationDeminimis: '',
      approverId: ''
    },
    validationSchema: eventSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('TotalRenderingPeriod', values.totalRenderingPeriod);
        formData.append('TargetStartDate', values.targetStartDate);
        formData.append('ProbitionarySalary', values.probationarySalary);
        formData.append('ProbitionaryDeminimis', values.probationaryDeminimis);
        formData.append('RegularSalary', values.regularizationSalary);
        formData.append('RegularDeminimis', values.regularizationDeminimis);
        formData.append('JobOfferStatusId', candidate.jobOfferStatusId);
        // formData.append('CandidateId', candidateId);
        formData.append('ApproverId', values.approverId);

        const res = await updateJobOfferInfo(candidateId, formData);
        
        if (res.status === 200) {
          Swal.fire('Updated!', 'Job Offer Information Updated Succesfully', 'success');
          setStatus('success');
          formik.resetForm();
          handleClose();
          navigate('/recruitment/joboffer');
        } else {
          Swal.fire('Correction Failed!', res?.data?.responseText || 'An unexpected error occurred.', 'warning');
        }      
        
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!show) {
      formik.resetForm();
      return;
    }

    const fetchJobOfferInfo = async () => {
      console.log(jobOfferId)
      if (!jobOfferId) return;
      setLoading(true);
      try {
        const res = await getJobOfferInfo(jobOfferId);
        console.log(res.data)
        if (res.status === 200 && res.data) {
          formik.setValues({
            totalRenderingPeriod: res.data.jobOfferInfo.totalRenderingPeriod || '',
            targetStartDate: res.data.jobOfferInfo.targetStartDate || '',
            probationarySalary: res.data.jobOfferInfo.probitionarySalary || '',
            probationaryDeminimis: res.data.jobOfferInfo.probitionaryDeminimis || '',
            regularizationSalary: res.data.jobOfferInfo.regularSalary || '',
            regularizationDeminimis: res.data.jobOfferInfo.regularDeminimis || '',
            approverId: parseInt(res.data.jobOfferInfo.approverId) || ''
          });
          setCandidate(res.data.jobOfferInfo)
          setCandidateId(res.data.jobOfferInfo.candidateId)
        }
      } catch (error) {
        console.error('Error fetching job offer info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOfferInfo();
  }, [show, jobOfferId]);

  useEffect(() => {
    if (!candidate.clientId) {
      setListApprovers([]);
      return;
    }

    const fetchApprovers = async () => {
      setLoading(true);
      try {
        const response = await SelectTafApproverDropDown(candidate.clientId);
        setListApprovers(response.data.values || []);
      } catch (error) {
        console.error('Error fetching approvers:', error);
        setListApprovers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovers();
  }, [candidate]);

  return (
    // <Modal className='modal-sticky modal-lg' show={show} onHide={handleClose} animation={false}>
    //   <div className='modal-content'>
    //     <div className='d-flex align-items-center justify-content-between py-5 px-8 border-bottom'>
    //       <h5 className='fw-bold m-0'>Job Offer Data Entry</h5>
    //       <div className='btn btn-icon btn-sm btn-light-danger' onClick={handleClose}>
    //         <KTIcon className='fs-1' iconName='cross' />
    //       </div>
    //     </div>

    //     <div className="card w-100">
    //       <form onSubmit={formik.handleSubmit}>
    //         {formik.status && <div className="alert alert-danger">{formik.status}</div>}

    //         <div className="card-body">
    //           {/* <label className="form-label">From Email</label>
    //           <input className="form-control" {...formik.getFieldProps('fromUserEmail')} />
    //           {formik.errors.fromUserEmail && <div className="text-danger mt-2">{formik.errors.fromUserEmail}</div>} */}

    //           <div className="row my-2">
    //             <div className="col-md-6">
    //               <label className="form-label">Candidate: <span className='fw-bold fs-4'>{candidate.candidateName}</span></label>
                  
    //             </div>
    //             <div className="col-md-6">
    //             <label className="form-label">Position: <span className='fw-bold fs-4'>{candidate.position}</span></label>
    //             </div>
    //           </div>

              
    //           {/* <div className="row my-2">
    //             <div className="col-md-6">
    //               <label className="form-label">Current Salary: <span className='fw-bold fs-4'>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidate.currentSalary)}</span></label>
                  
    //             </div>
    //             <div className="col-md-6">
    //             <label className="form-label">Expected Salary: <span className='fw-bold fs-4'>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidate.expectedSalary)}</span></label>
    //             </div>
    //           </div> */}

    //           <div className="row my-2">
    //             <div className="col-md-6">
    //               <label className="form-label">Hiring Manager:</label>
                  
    //               <select {...formik.getFieldProps('approverId')} className="form-control">
    //                 <option value="" hidden>Select Hiring Manager</option>
    //                 {listApprovers.map((approver) => (
    //                     <option key={approver.id} value={approver.value}>
    //                       {approver.label}
    //                     </option>
    //                   ))}
    //               </select>
    //             </div>
    //           </div>

    //           <div className="row my-2">
    //             <div className="col-md-6">
    //               <label className="form-label">Total Rendering Period (Day's)</label>
    //               <input type="number" className="form-control" {...formik.getFieldProps('totalRenderingPeriod')} />
    //               {formik.errors.totalRenderingPeriod && <div className="text-danger mt-2">{formik.errors.totalRenderingPeriod}</div>}
    //             </div>
    //             <div className="col-md-6">
    //               <label className="form-label">Target Start Date</label>
    //               <input type="datetime-local" className="form-control" {...formik.getFieldProps('targetStartDate')} />
    //               {formik.errors.targetStartDate && <div className="text-danger mt-2">{formik.errors.targetStartDate}</div>}
    //             </div>
    //           </div>

    //           <div className="my-2 card p-2">
    //           <span className="fs-4 fw-bold text-gray-600">Probationary Package:</span>
    //             <div className='d-flex gap-2'>
    //               <div className="flex-fill">
    //                 <label className="form-label">Basic Salary</label>
    //                 <input type="number" className="form-control" {...formik.getFieldProps('probationarySalary')} />
    //                 {formik.errors.probationarySalary && <div className="text-danger mt-2">{formik.errors.probationarySalary}</div>}
    //               </div>
    //               <div className="flex-fill">
    //                 <label className="form-label">Deminimis</label>
    //                 <input type="number" className="form-control" {...formik.getFieldProps('probationaryDeminimis')} />
    //                 {formik.errors.probationaryDeminimis && <div className="text-danger mt-2">{formik.errors.probationaryDeminimis}</div>}
    //               </div>
    //             </div>
    //           </div>

    //           <div className="my-3 card p-2">
    //           <span className="fs-4 fw-bold text-gray-600">Regularization Package (after 6 months):</span>
    //             <div className='d-flex gap-2'>
    //               <div className="flex-fill">
    //                 <label className="form-label">Basic Salary</label>
    //                 <input type="number" className="form-control" {...formik.getFieldProps('regularizationSalary')} />
    //                 {formik.errors.regularizationSalary && <div className="text-danger mt-2">{formik.errors.regularizationSalary}</div>}
    //               </div>
    //               <div className="flex-fill">
    //                 <label className="form-label">Deminimis</label>
    //                 <input type="number" className="form-control" {...formik.getFieldProps('regularizationDeminimis')} />
    //                 {formik.errors.regularizationDeminimis && <div className="text-danger mt-2">{formik.errors.regularizationDeminimis}</div>}
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="card-footer text-center">
    //           <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>
    //             Cancel
    //           </button>
    //           <button type="submit" className="btn btn-danger" disabled={loading || formik.isSubmitting}>
    //             {loading ? 'Saving...' : 'Submit'}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </Modal>
    <>1</>
  );
};

export { JobOfferModal };

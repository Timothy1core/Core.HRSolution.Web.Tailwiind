import { useState,useEffect } from 'react';
// import { Modal } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import 'ckeditor5/ckeditor5.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { saveJobOfferInfo } from '../../core/requests/_request';
import {
  SelectTafApproverDropDown,
} from '../../../talent.acquisition/request/taf_dropdown_request'

const eventSchema = Yup.object().shape({
  totalRenderingPeriod: Yup.number().required('Required'),
  targetStartDate: Yup.string().required('Required'),
  probationarySalary: Yup.string().required('Required'),
  probationaryDeminimis: Yup.string().required('Required'),
  regularizationSalary: Yup.string().required('Required'),
  regularizationDeminimis: Yup.string().required('Required'),
  approverId: Yup.string().required('Required'),
});

const JobOfferModal = ({ show, handleClose, candidate, candidateId }) => {
  const [loading, setLoading] = useState(false);
  const [listApprovers, setListApprovers] = useState([]);
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
        formData.append('JobOfferStatusId', 1);
        formData.append('CandidateId', candidateId);
        formData.append('ApproverId', values.approverId);
        const res = await saveJobOfferInfo(formData);
        


        if (res.status == 200) {
          alert('The Candidate Has Been Moved to Job Offer Module!');
          setStatus('success');
          formik.resetForm();
          handleClose();
          navigate('/recruitment/joboffer');
        } else {
          Swal.fire(
            'Correction Failed!',
            res?.data?.responseText || 'An unexpected error occurred.',
            'warning'
          );
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
    }
  }, [show, candidate]);

  useEffect(() => {
    if (!candidate.clientId) {
      setListApprovers([]);
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await SelectTafApproverDropDown(candidate.clientId);
        setListApprovers(response.data.values || []);
      } catch (error) {
        console.error('Error fetching options:', error);
        setListApprovers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [candidate]); // Runs only when clientId changes      

  return (
    // <Modal
    //   className='modal-sticky modal-lg'
    //   show={show}
    //   onHide={handleClose}
    //   animation={false}
    // >
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
    //               <label className="form-label">Candidate: <span className='fw-bold fs-4'>{candidate.firstName + " " + candidate.lastName}</span></label>
                  
    //             </div>
    //             <div className="col-md-6">
    //             <label className="form-label">Position: <span className='fw-bold fs-4'>{candidate.jobName}</span></label>
    //             </div>
    //           </div>

              
    //           <div className="row my-2">
    //             <div className="col-md-6">
    //               <label className="form-label">Current Salary: <span className='fw-bold fs-4'>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidate.currentSalary)}</span></label>
                  
    //             </div>
    //             <div className="col-md-6">
    //             <label className="form-label">Expected Salary: <span className='fw-bold fs-4'>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidate.expectedSalary)}</span></label>
    //             </div>
    //           </div>

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

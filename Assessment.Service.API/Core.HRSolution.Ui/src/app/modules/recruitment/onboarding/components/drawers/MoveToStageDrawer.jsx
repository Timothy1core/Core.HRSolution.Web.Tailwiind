import { KTIcon } from '../../../../../../_metronic/helpers';
import { updateOnboardingStatus, updateCandidateToHired } from '../../core/requests/_request';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { Offcanvas  } from 'react-bootstrap';

const stageSchema = Yup.object().shape({
  stage: Yup.string().required('Required'),
});

const MoveToStageWrapper = ({startDate, orientationDate, applicationProcessesData, currentStage, candidateId, handleCloseWithRefresh, handleClose, handleShow, handleShowAddTempId, temporaryId }) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
      initialValues: { 
        stage: '',
      },
      validationSchema: stageSchema,
      validateOnChange: false,
      validateOnBlur: true,
      onSubmit: async (values, { setSubmitting, setStatus }) => {
        setLoading(true);
        // ✅ Block submission if stage is 3 and startDate is null/undefined/empty
        if (values.stage === '4' && !startDate) {
          Swal.fire({
            title: 'Start Date Required',
            text: 'Please set a Start Date before moving to this stage.',
            icon: 'warning',
            confirmButtonText: 'OK',
          });
          setLoading(false);
          setSubmitting(false);
          return; // 🚫 Prevent submission
        }
        if (values.stage === '2' && !orientationDate) {
          Swal.fire({
            title: 'Orientation Date Required',
            text: 'Please set a Orientation Date before moving to this stage.',
            icon: 'warning',
            confirmButtonText: 'OK',
          });
          setLoading(false);
          setSubmitting(false);
          return; // 🚫 Prevent submission
        }
        try {
          console.log(values.stage)
          let res;
          res = await updateOnboardingStatus(candidateId, values.stage);
          if (res.data.success && values.stage == 4 && !temporaryId) {
            Swal.fire({
              title: 'Updated!',
              text: `Stage has been Updated Successfully`,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                  formik.resetForm();
                  handleClose();
                  handleShowAddTempId();
                }
            });     
          }
          else if (res.data.success && values.stage == 5 && temporaryId) {
            formik.resetForm();
            handleClose();
            let response = await updateCandidateToHired(candidateId);
            if(response.data.success){
              Swal.fire({
                title: 'Candidate Hired!',
                text: `Candidate Moved to Hired Successfully`,
                icon: 'success',
                confirmButtonText: 'OK',
              });
            }  
          }
          else if(res.data.success && (values.stage == 6 || values.stage == 4)){
            Swal.fire({
              title: 'Updated!',
              text: `Stage has been Updated Successfully`,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                  formik.resetForm();
                  handleCloseWithRefresh()
                }
            });   
          }
        } catch (error) {
          console.error(error);
          setStatus(error.response.data.title ||error.message || 'An error occurred');
        } finally {
          setSubmitting(false);
          setLoading(false);
          
        }
      },
    });
    
    const handleStageChange = (e) => {
      const selectedStageId = e.target.value;
      formik.setFieldValue('stage', selectedStageId);
    };   


      useEffect(() => {
        if (applicationProcessesData?.length > 0) {
          formik.setValues({
            stage: currentStage,
          });
        }
      }, [currentStage, applicationProcessesData]);      
    

  return (
      <Offcanvas show={handleShow} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
          <Offcanvas.Title>Move To Stage</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <form onSubmit={formik.handleSubmit}>
          <div className="card-body hover-scroll-overlay-y">
            <label className='form-label'>Application Stage</label>
            <select
                className='form-select form-select-solid'
                {...formik.getFieldProps('stage')}
                onChange={handleStageChange}
              >
                <option value='' hidden>Select stage</option>
                {applicationProcessesData.map((processess) => (
                  <option key={processess.id} value={processess.id}>
                    {processess.status}
                  </option>
                ))}
              </select>
              {formik.touched.stage && formik.errors.stage && (
                    <div className='text-danger mt-2'>{formik.errors.stage}</div>
                  )}     
          </div>
          <div className="card-footer">
          <div className="mt-4 text-center" >
              <button
                type='button'
                className="btn btn-secondary me-2"
                onClick={handleClose}
                disabled={loading || formik.isSubmitting}
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? 'Saving...' : 'Move'}
                </button>
            </div>
          </div>
        </form>
        </Offcanvas.Body>
      </Offcanvas>
  );
};

export { MoveToStageWrapper };
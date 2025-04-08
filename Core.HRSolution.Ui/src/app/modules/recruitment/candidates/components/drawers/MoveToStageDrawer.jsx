import { KTIcon } from '@/_metronic/helpers';
import { updateStage } from '../../core/requests/_request';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
// import { Offcanvas  } from 'react-bootstrap';

const stageSchema = Yup.object().shape({
  stage: Yup.string().required('Required'),
});

const MoveToStageWrapper = ({applicationProcessesData, currentStage, candidateId, handleCloseWithRefresh, handleClose, handleShow, handleOpenJobOfferModal }) => {
    const [loading, setLoading] = useState(false);
    const [stageName, setStageName] = useState('');

    const formik = useFormik({
      initialValues: { 
        stage: '',
      },
      validationSchema: stageSchema,
      validateOnChange: false,
      validateOnBlur: true,
      onSubmit: async (values, { setSubmitting, setStatus }) => {
        setLoading(true);
        try {
          let res;
          res = await updateStage(candidateId, values.stage, stageName);
          if (res.data.success) {
            setStatus('success');
            console.log(values.stage,'asdasd')
          if(values.stage == 9){
            Swal.fire({
              title: 'Updated!',
              text: `Stage has been Updated Successfully`,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                  formik.resetForm();
                  handleCloseWithRefresh()
                  handleOpenJobOfferModal()
                }
            });  
          }else{
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
      const selectedStage = applicationProcessesData.find(
        (process) => process.applicationProcessId == selectedStageId
      );
  
      setStageName(selectedStage?.applicationProcess.processName || '');
      formik.setFieldValue('stage', selectedStageId);
    };   


      useEffect(() => {
        
        if (applicationProcessesData?.length > 0) {
          const currentStageData = applicationProcessesData.find(
            (process) => process.id === currentStage
          );
          setStageName(currentStageData?.applicationProcess.processName || '');
          formik.setValues({
            stage: currentStage,
          });
        }
      }, [currentStage, applicationProcessesData]);      
    

  return (
      // <Offcanvas show={handleShow} onHide={handleClose} placement="end">
      // <Offcanvas.Header closeButton>
      //     <Offcanvas.Title>Move To Stage</Offcanvas.Title>
      //   </Offcanvas.Header>
      //   <Offcanvas.Body>
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
                  <option key={processess.applicationProcessId} value={processess.applicationProcessId}>
                    {processess.applicationProcess.processName}
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
      //   </Offcanvas.Body>
      // </Offcanvas>
  );
};

export { MoveToStageWrapper };
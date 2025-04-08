import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { createApi, infoApi, updateApi } from '../../../core/requests/_request';
// import { Modal, Button } from 'react-bootstrap';

const apiSchema = Yup.object().shape({
  apiName: Yup.string()
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
});

const CreateEditApi = ({ id, editMode, showModal, handleClose, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { apiName: '' },
    validationSchema: apiSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {

        let res;
        if (editMode) {
          res = await updateApi(id, values.apiName); // Update if editMode is true
        } else {
          res = await createApi(values.apiName); // Create if editMode is false
        }
        
        if (res.data.success) handleCloseWithRefresh();
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
    if (editMode) {
      infoApi(id).then(response => {
        formik.setValues({ apiName: response.data.api.apiPermission });
      }).catch(error => {
        formik.setStatus('Error fetching API data');
      });
    } else {
      formik.resetForm();
    }
  }, [id, editMode]);

  return (
    // <Modal show={showModal} onHide={handleClose} centered>
    //   <Modal.Header closeButton><Modal.Title>{editMode ? 'Edit API' : 'Add API'}</Modal.Title></Modal.Header>
    //   <Modal.Body>
    //         <form onSubmit={formik.handleSubmit}>
    //           {formik.status && (
    //             <div className='mb-lg-10 alert alert-danger'>
    //               <div className='alert-text font-weight-bold'>{formik.status}</div>
    //             </div>
    //           )}

    //           <div className='fv-row mb-10'>
    //             <label className='form-label required'>Api Name</label>
    //             <input
    //               name='apiName'
    //               className='form-control form-control-lg form-control-solid'
    //               {...formik.getFieldProps('apiName')}
    //             />
    //             {formik.touched.apiName && formik.errors.apiName && (
    //               <div className='text-danger mt-2'>{formik.errors.apiName}</div>
    //             )}
    //           </div>

    //           <div className='d-flex flex-center flex-row-fluid pt-5'>
    //             <button type='reset' className='btn btn-light me-3' data-bs-dismiss='modal'>
    //               Cancel
    //             </button>

    //             <button
    //               type='submit'
    //               className='btn btn-danger'
    //               disabled={formik.isSubmitting || !formik.isValid}
    //             >
    //               {!loading && <span className='indicator-label'>Submit</span>}
    //               {loading && (
    //                 <span className='indicator-progress' style={{ display: 'block' }}>
    //                   Please wait...
    //                   <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
    //                 </span>
    //               )}
    //             </button>
    //           </div>
    //         </form>
    //         </Modal.Body>
    //         </Modal>
    <>1</>
  );
};

export { CreateEditApi };

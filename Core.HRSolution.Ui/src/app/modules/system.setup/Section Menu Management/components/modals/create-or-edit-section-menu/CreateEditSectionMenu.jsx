import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { createSectionMenu, infoSectionMenu, updateSectionMenu, listSectionMenu } from '../../../core/requests/_request';
// import { Modal, Button } from 'react-bootstrap';


const sectionMenuSchema = Yup.object().shape({
  sectionName: Yup.string()
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
  orderBy: Yup.number().required('Required').typeError('Must be a number'),
});

const CreateEditSectionMenu = ({ id, editMode, showModal, handleClose, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);


  const formik = useFormik({
    initialValues: {
      sectionName: '',
      orderBy: '',
    },
    validationSchema: sectionMenuSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        let res;
        if (editMode) {
          res = await updateSectionMenu(
            id,
            values.sectionName, 
            values.orderBy
          );
        } else {
          res = await createSectionMenu(
            values.sectionName, 
            values.orderBy
          );
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
      infoSectionMenu(id).then(response => {
        formik.setValues({
          sectionName: response.data.sectionMenus.sectionName,
          orderBy: response.data.sectionMenus.orderBy,
        });
      }).catch(error => {
        formik.setStatus('Error fetching section menu data');
      });
    } else {
      formik.resetForm();
    }
  }, [id, editMode]);

  return (
    // <Modal show={showModal} onHide={handleClose} centered>
    //   <Modal.Header closeButton><Modal.Title>{editMode ? 'Edit Section Menu' : 'Add Section Menu'}</Modal.Title></Modal.Header>
    //   <Modal.Body>
    //         <form onSubmit={formik.handleSubmit}>
    //           {formik.status && (
    //             <div className='mb-lg-10 alert alert-danger'>
    //               <div className='alert-text font-weight-bold'>{formik.status}</div>
    //             </div>
    //           )}

    //           <div className='fv-row d-flex mb-5'>
    //             <div className='me-4 flex-fill'>
    //               <label className='form-label required'>Section Menu Name</label>
    //               <input
    //                 name='sectionName'
    //                 className='form-control form-control-lg form-control-solid'
    //                 {...formik.getFieldProps('sectionName')}
    //               />
    //               {formik.touched.sectionName && formik.errors.sectionName && (
    //                 <div className='text-danger mt-2'>{formik.errors.sectionName}</div>
    //               )}
    //             </div>
    //           </div>

    //           <div className='fv-row d-flex mb-5'>
                
    //             <div  className='flex-fill'>
    //               <label className='form-label required'>Order By</label>
    //               <input
    //                 name='orderBy'
    //                 className='form-control form-control-lg form-control-solid'
    //                 {...formik.getFieldProps('orderBy')}
    //               />
    //               {formik.touched.orderBy && formik.errors.orderBy && (
    //                 <div className='text-danger mt-2'>{formik.errors.orderBy}</div>
    //               )}
    //             </div>
    //           </div>

    //           <div className='d-flex flex-center flex-row-fluid pt-12'>
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

export { CreateEditSectionMenu };

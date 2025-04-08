import { useRef, useState, useEffect } from 'react';


import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { Modal, Accordion } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import { createWriteUp, updateWriteUp } from '../../core/requests/_request';
import { 
   ClassicEditor,
   Bold, 
   Essentials, 
   Italic, 
   Paragraph, 
   List, 
   Heading, 
   Link, 
   Table, 
   TableToolbar,
   TableProperties, 
   TableCellProperties ,
   Indent, IndentBlock, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Base64UploadAdapter, FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';

const writeUpSchema = Yup.object().shape({

  profileOverview: Yup.string().required('Required'),
  professsionalBackground: Yup.string().required('Required'),
  skills: Yup.string().required('Required'),
  behavioral: Yup.string().required('Required'),
  others: Yup.string().required('Required'),
});

const WriteUpModal = ({ show, handleClose, WriteUp, candidateId, hasWriteUp, handleCloseWithReload }) => {
  const pdfRef = useRef();
  

  const CKEditorConfig = {
    plugins: [
      Essentials, Bold, Italic, Paragraph, List, Heading, Link,
      Table, TableToolbar,TableProperties, TableCellProperties, Indent, IndentBlock, Image,
      ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload,
      Base64UploadAdapter, FontSize
    ],
    toolbar: [
      'undo', 'redo', '|',
      'heading', '|',
      'bulletedList', 'numberedList', '|',
      'bold', 'italic', '|',
      'insertTable', '|', 'indent', 'outdent',
    ],
    table: {
      contentToolbar: [
        'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'
    ],
    defaultHeadings: { rows: 1, columns: 1 }
    },
    viewportTopOffset: 60
  };
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { 
      profileOverview: '',
      professsionalBackground: '',
      skills: '',
      behavioral: '',
      others: '',
    },
    validationSchema: writeUpSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      
      try {
        let res;
        if (!hasWriteUp) {
          // Trigger create API
          res = await createWriteUp(candidateId, values.profileOverview, values.professsionalBackground, values.skills, values.behavioral, values.others);
          if (res.data.success) {
            setStatus('success');
            formik.resetForm();
            handleCloseWithReload();
            Swal.fire('Created', 'Write Up has been Created Successfully!', 'success');
            }
        } else {
          // Trigger update API
          res = await updateWriteUp(candidateId, values.profileOverview, values.professsionalBackground, values.skills, values.behavioral, values.others);
          if (res.data.success) {
            setStatus('success');
            formik.resetForm();
            handleCloseWithReload();
            Swal.fire('Updated', 'Write Up has been Updated Successfully!', 'success');
            }
        }
        // onCreateQuestion(newQuestion); // Call the parent method to create a new question
        formik.resetForm();
      } catch (error) {
        console.error(error);
        setStatus(error.response.data.title ||error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
        
      }
    },
  });
  
  // Initialize state with WriteUp values
  useEffect(() => {
    if (WriteUp) {
        formik.setValues({
          profileOverview: WriteUp.profileOverview || '',
          professsionalBackground:WriteUp.professionalBackground || '',
          skills:WriteUp.skills || '',
          behavioral:WriteUp.behavioral || '',
          others:WriteUp.notes || '',
        });
      // setEditorValues(initialValues);
    }
  }, [WriteUp]);


  return (
    // <Modal
    //   className='modal-sticky modal-sticky-lg modal-sticky-bottom-right modal-xl'
    //   id='kt_inbox_compose'
    //   role='dialog'
    //   data-backdrop='false'
    //   // aria-hidden='true'
    //   tabIndex='-1'
    //   show={show}
    //   animation={false}
    // >
    //   <div className='modal-content' >
    //     <form onSubmit={formik.handleSubmit} >
    //     {formik.status && (
    //             <div className="mb-lg-10 alert alert-danger">
    //               <div className="alert-text font-weight-bold">{formik.status}</div>
    //             </div>
    //           )}
    //     <div>
    //       <div className='d-flex align-items-center justify-content-between py-5 px-8 border-bottom'>
    //         <div className='d-flex align-items-center '>
    //           <h5 className='fw-bold m-0 me-5'>Compose Write up</h5>
    //           {/* <div className='btn btn-icon btn-sm btn-light-danger'>
    //             <KTIcon className='fs-1' iconName='printer' />
    //           </div> */}
    //         </div>
    //         <div className='d-flex ms-2'>
    //           <div className='btn btn-icon btn-sm btn-light-danger ms-2' data-bs-dismiss='modal' onClick={handleClose}>
    //             <KTIcon className='fs-1' iconName='cross' />
    //           </div>
    //         </div>
    //       </div>
    //       {/*begin::Body*/}
    //       <div className='d-block pt-5'>
    //         <Accordion>
    //           <Accordion.Item eventKey="0" className='text-center'>
    //             <Accordion.Header ><h3 className='fw-bold m-0 '>PROFILE OVERVIEW </h3></Accordion.Header>
    //             <Accordion.Body>
    //             <CKEditor
    //           editor={ClassicEditor}
    //           config={CKEditorConfig}
    //           data={formik.values.profileOverview}
    //           onChange={(event, editor) => {
    //             formik.setFieldValue('profileOverview', editor.getData());
    //             }}
    //           />

    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>
    //         {formik.touched.profileOverview && formik.errors.profileOverview && (
    //             <div className="text-danger mt-2">{formik.errors.profileOverview}</div>
    //           )}
    //       </div>

    //       {/*begin::Body*/}
    //       <div className='d-block'>
    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header ><h3 className='fw-bold m-0 '>PROFESSIONAL BACKGROUND </h3></Accordion.Header>
    //             <Accordion.Body>
    //               <CKEditor
    //               editor={ClassicEditor}
    //               config={CKEditorConfig}
    //               data={formik.values.professsionalBackground}
    //               onChange={(event, editor) => {
    //                 formik.setFieldValue('professsionalBackground', editor.getData());
    //                 }}
    //               />
    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>              
    //           {formik.touched.professsionalBackground && formik.errors.professsionalBackground && (
    //             <div className="text-danger mt-2">{formik.errors.professsionalBackground}</div>
    //           )}
    //       </div>

    //       {/*begin::Body*/}
    //       <div className='d-block'>
    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header ><h3 className='fw-bold m-0 '>KEY COMPETENCIES</h3></Accordion.Header>
    //             <Accordion.Body>
    //               <CKEditor
    //               editor={ClassicEditor}
    //               config={CKEditorConfig}
    //               data={formik.values.skills}
    //               onChange={(event, editor) => {
    //                 formik.setFieldValue('skills', editor.getData());
    //                 }}
    //               />
    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion> 
    //           {formik.touched.skills && formik.errors.skills && (
    //             <div className="text-danger mt-2">{formik.errors.skills}</div>
    //           )}
    //       </div>

    //       {/*begin::Body*/}
    //       <div className='d-block'>

    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header ><h3 className='fw-bold m-0 '>BEHAVIORAL ASSESSMENT</h3></Accordion.Header>
    //             <Accordion.Body>
    //               <CKEditor
    //               editor={ClassicEditor}
    //               config={CKEditorConfig}
    //               data={formik.values.behavioral}
    //               onChange={(event, editor) => {
    //                 formik.setFieldValue('behavioral', editor.getData());
    //                 }}
    //               />
    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion>  
    //           {formik.touched.behavioral && formik.errors.behavioral && (
    //             <div className="text-danger mt-2">{formik.errors.behavioral}</div>
    //           )}
    //       </div>
    //       {/*begin::Body*/}
    //       <div className='d-block'>

    //         <Accordion>
    //           <Accordion.Item eventKey="0">
    //             <Accordion.Header ><h3 className='fw-bold m-0 '>OTHERS</h3></Accordion.Header>
    //             <Accordion.Body>
    //                 <CKEditor
    //               editor={ClassicEditor}
    //               config={CKEditorConfig}
    //               data={formik.values.others}
    //               onChange={(event, editor) => {
    //                 formik.setFieldValue('others', editor.getData());
    //                 }}
    //               />
    //             </Accordion.Body>
    //           </Accordion.Item>
    //         </Accordion> 
    //           {formik.touched.others && formik.errors.others && (
    //             <div className="text-danger mt-2">{formik.errors.others}</div>
    //           )}
    //       </div>

    //       {/* Footer */}
    //       <div className='d-flex align-items-center justify-content-center py-5 ps-8 pe-5 border-top'>
    //         <div className='d-flex align-items-center me-3'>
    //           <button data-bs-dismiss='modal' onClick={handleClose} type='button' className='btn btn-secondary me-4 px-6'>Cancel</button>
    //           <button
    //               type="submit"
    //               className="btn btn-danger px-6"
    //               disabled={loading || formik.isSubmitting}
    //             >
    //               {loading ? 'Saving...' : 'Save Changes'}
    //             </button>
    //         </div>
    //       </div>
    //     </div>
    //     </form>
    //   </div>
    // </Modal>

    <>1</>
  );
};

export { WriteUpModal };

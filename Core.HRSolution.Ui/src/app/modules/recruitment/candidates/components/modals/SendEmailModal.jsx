import { useState, useEffect } from 'react';
// import { Modal } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import { submitAnswerCorrection } from '../../core/requests/_request';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Base64UploadAdapter, FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';

const SendEmailModal = ({ show, handleClose, candidateEmail }) => {
  const [candidateEmailData, setCandidateEmail] = useState(candidateEmail || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({ subject: '', body: '' });

  const CKEditorConfig = {
    plugins: [
      Essentials, Bold, Italic, Paragraph, List, Heading, Link,
      Table, TableToolbar, Indent, IndentBlock, Image,
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
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    viewportTopOffset: 60
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { subject: '', body: '' };

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required.';
      isValid = false;
    }

    if (!body.trim()) {
      newErrors.body = 'Body content is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitCandidateCorrection = async () => {
    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'warning');
      return;
    }

    try {
      const res = await submitAnswerCorrection(candidateEmailData, subject, body);

      if (res?.data?.success) {
        Swal.fire('Submitted!', 'The Candidate Correction has been submitted.', 'success');
        handleClose();
      } else {
        Swal.fire(
          'Correction Failed!',
          res?.data?.responseText || 'An unexpected error occurred.',
          'warning'
        );
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.title || 'Failed to check the candidate answer.';
      console.error(errorMessage);
      Swal.fire('Error!', errorMessage, 'error');
    }
  };

  const handleModalClose = () => {
    setSubject('');
    setBody('');
    setErrors({ subject: '', body: '' });
    handleClose();
  };

  useEffect(() => {
    if (candidateEmail) {
      setCandidateEmail(candidateEmail);
    }
  }, [candidateEmail]);

  return (
    // <Modal
    //   className='modal-sticky modal-sticky-lg modal-sticky-bottom-right modal-lg'
    //   id='kt_inbox_compose'
    //   role='dialog'
    //   tabIndex='-1'
    //   show={show}
    //   onHide={handleModalClose}
    //   animation={false}
    // >
    //   <div className='modal-content'>
    //     <div className='d-flex align-items-center justify-content-between py-5 px-8 border-bottom'>
    //       <h5 className='fw-bold m-0 me-5'>Compose Email</h5>
    //       <div className='btn btn-icon btn-sm btn-light-danger ms-2' onClick={handleModalClose}>
    //         <KTIcon className='fs-1' iconName='cross' />
    //       </div>
    //     </div>

    //     <div className='d-block'>
    //       <div className='mx-8 my-5 border border-2 px-8 py-5 card'>
    //         <h5>Subject:</h5>
    //         <div className="mb-2 w-100">
    //           <input
    //             type='text'
    //             className={`form-control form-control-lg ${errors.subject ? 'is-invalid' : ''}`}
    //             value={subject}
    //             onChange={(e) => setSubject(e.target.value)}
    //           />
    //           {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
    //         </div>

    //         <h5>Body:</h5>
    //         <div className="mb-2 w-100">
    //           <CKEditor
    //             editor={ClassicEditor}
    //             config={CKEditorConfig}
    //             data={body}
    //             onChange={(event, editor) => setBody(editor.getData())}
    //           />
    //           {errors.body && <div className="text-danger mt-1">{errors.body}</div>}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Footer */}
    //     <div className='d-flex align-items-center justify-content-center py-5 ps-8 pe-5 border-top'>
    //       <button onClick={handleModalClose} type='button' className='btn btn-secondary me-4 px-6'>
    //         Cancel
    //       </button>
    //       <button onClick={handleSubmitCandidateCorrection} className='btn btn-danger px-6'>
    //         Submit
    //       </button>
    //     </div>
    //   </div>
    // </Modal>
    <>1</>
  );
};

export { SendEmailModal };

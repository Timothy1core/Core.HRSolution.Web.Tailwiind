import { useRef, useState, useEffect } from 'react';
// import { Modal } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import { ApiGateWayUrl, submitAnswerCorrection, listQuestionForChecking } from '../../core/requests/_request';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Base64UploadAdapter, FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';

const AnswerCheckingModal = ({ show, handleClose, candidateId, assessmentId }) => {
  const [assessmentsDetails, setAnswersNeedChecking] = useState([]);

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

  const handleSubmitCandidateCorrection = async (id, isCorrect) => {
    try {
      const res = await submitAnswerCorrection(id, isCorrect);

      if (res?.data?.success) {
        Swal.fire('Submitted!', 'The Candidate Correction has been submitted.', 'success');
        fetchQuestionsNeedToCheck(candidateId, assessmentId)
      } else {
        Swal.fire(
          'Correction Failed!',
          res?.data?.responseText || 'An unexpected error occurred.',
          'warning'
        );
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.title || 'Failed to check the candidate answer.';
      console.error(errorMessage);
      Swal.fire('Error!', errorMessage, 'error');
    }
  };

    const fetchQuestionsNeedToCheck = async (candidateId, assessmentId) => {

      try {
        const response = await listQuestionForChecking(candidateId, assessmentId);
        if (response) {

            setAnswersNeedChecking(response.data.assessmentCheckingDetails.questionDetails)
        }
      } catch (error) {
        console.log(error)
      } finally {
      }   
    };  

    useEffect(() => {
      fetchQuestionsNeedToCheck(candidateId, assessmentId)
    }, [candidateId, assessmentId]);

  return (
    <div
      className='modal modal-sticky modal-sticky-lg modal-sticky-bottom-right modal-lg'
      id='kt_inbox_compose'
      role='dialog'
      data-backdrop='false'
      // aria-hidden='true'
      tabIndex='-1'
      show={show}
      animation={false}
    >
      <div className='modal-content' >
        {/* <form onSubmit={formik.handleSubmit} > */}
        {/* {formik.status && (
                <div className="mb-lg-10 alert alert-danger">
                  <div className="alert-text font-weight-bold">{formik.status}</div>
                </div>
              )} */}
        <div>
          <div className='d-flex align-items-center justify-content-between py-5 px-8 border-bottom'>
            <div className='d-flex align-items-center '>
              <h5 className='fw-bold m-0 me-5'>Answers Need Manual Checking</h5>
              {/* <div className='btn btn-icon btn-sm btn-light-danger'>
                <KTIcon className='fs-1' iconName='printer' />
              </div> */}
            </div>
            <div className='d-flex ms-2'>
              <div className='btn btn-icon btn-sm btn-light-danger ms-2' data-bs-dismiss='modal' onClick={handleClose}>
                <KTIcon className='fs-1' iconName='cross' />
              </div>
            </div>
          </div>

          {assessmentsDetails.map((data, index) => (
            <div className='d-block ck-editor-bordered ' key={index}>
              <div className='mx-8 my-5 border border-2 px-8 py-5 card'>
                <h5>Question:</h5>
                <div className="mb-2 w-100">
                  <CKEditor
                    editor={ClassicEditor}
                    config={CKEditorConfig}
                    data={data.body}
                  />    
                  </div>
                <h5>Answer:</h5>  
                {data.type != 3 && 
                <div className="mb-2  w-100">
                <CKEditor
                    editor={ClassicEditor}
                    config={CKEditorConfig}
                    data={data.answer}
                  />  
                  </div>}
                {data.type == 3 && 
                // <ReactPlayer url= />  
                <div className="d-flex mb-2  w-100 justify-content-center">
                  <iframe className="w-100 rounded border"
                  style={{ maxWidth: "600px", height: "350px" }} src={`${ApiGateWayUrl()}/assessment/assessmentauth/candidate_video_answer/${data.answerId}`}></iframe>
                </div>
                
                }
                  
                <div className='d-flex justify-content-center'>
                  <div className=" btn-group border border-1 border-dark" role="group" aria-label="Basic radio toggle button group">
                    <input
                      type="radio"
                      className="btn-check"
                      name={`btnradio-${data.id}`} // Unique name per question
                      id={`wrong-${data.id}`}
                      defaultChecked={data.correction === false}
                      onClick={() => handleSubmitCandidateCorrection(data.correctionId, false)}
                    />
                    <label className="btn btn-outline-danger" htmlFor={`wrong-${data.id}`}>Wrong</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name={`btnradio-${data.id}`} // Unique name per question
                      id={`correct-${data.id}`}
                      defaultChecked={data.correction === true}
                      onClick={() => handleSubmitCandidateCorrection(data.correctionId, true)}
                    />
                    <label className="btn btn-outline-success" htmlFor={`correct-${data.id}`}>Correct</label>
                  </div>
                  {/* <div>
                     <button data-bs-dismiss='modal' onClick={() => handleSubmitCandidateCorrection(data.correctionId, data.correction)} type='button' className='btn btn-primary me-4 px-6'>Submit</button>
                  </div>                 */}
                </div>  
              </div>
            </div>    
          ))}
          {/*begin::Body*/}

          {/* Footer */}
          <div className='d-flex align-items-center justify-content-center py-5 ps-8 pe-5 border-top'>
            <div className='d-flex align-items-center me-3'>
              {/* <button data-bs-dismiss='modal' onClick={handleClose} type='button' className='btn btn-secondary me-4 px-6'>Cancel</button>
              <button
                  type="submit"
                  className="btn btn-danger px-6"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button> */}
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export { AnswerCheckingModal };

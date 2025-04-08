import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
// import { Modal } from 'bootstrap';
import { listQuestionTypes, updateQuestion } from '../../../core/requests/_request';
import Swal from 'sweetalert2';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock, Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Base64UploadAdapter,
  FontSize  } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';

const questionSchema = Yup.object().shape({
  questionType: Yup.string().required('Required'),
  questionBody: Yup.string().required('Required'),
  marks: Yup.number().min(0, 'mark cannot be negative').required('Required'),
  answer: Yup.string().required('Required'),
  videoDuration: Yup.number().min(0, 'Video duration cannot be negative').required('Required'),
});

const EditQuestion = ({onModalClose, selectedQuestion }) => {
  const CKEditorConfig = {
    plugins: [
        Essentials, Bold, Italic, Paragraph, List, Heading, Link,
        Table, TableToolbar, Indent, IndentBlock, Image,
        ImageCaption,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Base64UploadAdapter,
        FontSize 
    ],
    toolbar: [
      'undo', 'redo', '|',
      'heading', '|',
      'bulletedList', 'numberedList', '|',
      'bold', 'italic', '|',
      'insertTable', '|', 'indent', 'outdent'
  ],
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    viewportTopOffset: 60
  };
  
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionId, setQuestionId] = useState(null);

  const handleHideModal = () => {

    
        
    formik.resetForm();
    const modalElement = document.getElementById('edit-question');
    // const modalInstance = Modal.getInstance(modalElement);
    if (modalElement) {
      // Get the modal instance
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);

      if (modalInstance) {
          // Hide the modal using Bootstrap's API
          modalInstance.hide();
          // Fallback if modal instance isn't correctly initialized
          modalElement.classList.remove('show');
          modalElement.setAttribute('aria-hidden', 'true');
          modalElement.style.display = 'none';

          // Remove backdrop manually if any
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
              backdrop.parentNode.removeChild(backdrop);
          }     
          
          // Restore scrolling by removing the 'modal-open' class
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
    }
  };
  
  const handleEditChoice = (index) => {

    setNewChoice(choices[index].body);
    setIsAddingChoice(true);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleAddChoiceButton = () => {
    setIsAddingChoice(true);
  };

  const handleSaveChoice = () => {
    if (newChoice.trim()) {
      if (isEditing) {
        const updatedChoices = [...choices];
        updatedChoices[editingIndex] = {
          ...updatedChoices[editingIndex],
          body: newChoice, // Update the body
        };
        setChoices(updatedChoices);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        setChoices([...choices, { body: newChoice, id: null }]); // New choice has no ID
      }
      setNewChoice('');
      setIsAddingChoice(false);
    }
  };

  const handleDeleteChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleCancelChoice = () => {
    setNewChoice('');
    setIsAddingChoice(false);
    setIsEditing(false);
  };

  const handleChoiceInputChange = (event) => {
    setNewChoice(event.target.value);
  };

  const formik = useFormik({
    initialValues: { 
      questionType: '',
      questionBody: '',
      marks: '',
      answer: '',
      answerId: null,  // Retain answer ID
      videoDurationId: null,
      required: false,
      videoDuration: 0
    },
    validationSchema: questionSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const Answers = [{
          answerBody: values.answer,
          id: values.answerId || 0, // Use existing ID or null for a new answer
        }];
        const videoDuration = [{
          VideoDurationMinute: values.videoDuration,
          id: values.videoDurationId || 0, // Use existing ID or null for a new answer
        }];

        const Choices = values.questionType === 1 
        ? choices.map((choice) => ({
            choiceBody: choice.body, 
            id: choice.id || 0, // Use existing ID or null for new choices
          }))
        : null;

        let res;
        res = await updateQuestion(
        questionId,
        values.questionBody,
        values.questionType,
        values.required,
        values.marks,
        Answers,
        videoDuration,
        Choices,
        );
        formik.resetForm();
        setChoices([]);
      } catch (error) {
        console.error(error);
        setStatus(error.response.data.title ||error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
        handleHideModal();
        onModalClose();
        Swal.fire('Updated', 'Question has been Updated Successfully!', 'success');
      }
    },
  });

  const fetchQuestionTypes = async () => {
    try {
      const response = await listQuestionTypes();
      if (response.data?.questionTypes) {
        setQuestionTypes(response.data.questionTypes);
      }
    } catch (error) {
      console.error("Error fetching question types:", error);
      formik.setStatus("Error fetching question types");
    }
  };


  useEffect(() => {
    const modalElement = document.getElementById('edit-question');
    // const modal = new Modal(modalElement);
  
    const handleModalShown = () => {

      if (selectedQuestion) {
        formik.setValues({
          questionType: selectedQuestion.type || '',
          questionBody: selectedQuestion.body || '',
          marks: selectedQuestion.marks || '',
          answer: selectedQuestion.answers?.[0]?.answerBody || '',
          answerId: selectedQuestion.answers?.[0]?.id || null,
          videoDurationId: selectedQuestion.videoDurations?.[0]?.id || null,
          videoDuration: selectedQuestion.videoDurations?.[0]?.videoDurationMinute || 0,
          required: selectedQuestion.required || false,
        });
  
        if (selectedQuestion.choices) {
          setChoices(
            selectedQuestion.choices.map((choice) => ({
              body: choice.choiceBody,
              id: choice.id, // Retain choice ID
            }))
          );
        }
        setQuestionId(selectedQuestion.id)
      }
      fetchQuestionTypes();
    };
  
    modalElement.addEventListener('shown.bs.modal', handleModalShown);
    modalElement.addEventListener('hidden.bs.modal', handleHideModal);
  
    return () => {
      modalElement.removeEventListener('shown.bs.modal', handleModalShown);
      modalElement.removeEventListener('hidden.bs.modal', handleHideModal);
    };
  }, [selectedQuestion]);

  return (
    <div className="modal fade" id="edit-question" aria-hidden="true">
      <div className="modal-dialog mw-650px">
        <div className="modal-content">
          <div className="modal-header pb-0 border-0 justify-content-end">
            <div className="btn btn-sm btn-icon btn-active-color-danger" data-bs-dismiss="modal" onClick={handleHideModal}>
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <div className="modal-body mx-5 mx-xl-18 pt-0 pb-5">
            <form onSubmit={formik.handleSubmit}>
              {formik.status && (
                <div className="mb-lg-10 alert alert-danger">
                  <div className="alert-text font-weight-bold">{formik.status}</div>
                </div>
              )}
              <div className="text-center mb-13">
                <h1 className="mb-3">Edit Question</h1>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label required">Type</label>
                <select
                  className="form-select form-select-solid"
                  {...formik.getFieldProps("questionType")}
                >
                  <option value="" hidden>Select Question Types</option>
                  {questionTypes.map((questionType) => (
                    <option key={questionType.id} value={questionType.id}>
                      {questionType.typeName}
                    </option>
                  ))}
                </select>
                {formik.touched.questionType && formik.errors.questionType && (
                  <div className="text-danger mt-2">{formik.errors.questionType}</div>
                )}
              </div>

              <div className="fv-row mb-10">
                <label className="form-label required">Question</label>
                <CKEditor
                              editor={ClassicEditor}
                              config={CKEditorConfig}
                              data={formik.values.questionBody}
                              onChange={(event, editor) => {
                                  formik.setFieldValue('questionBody', editor.getData());
                              }}
                            /> 
                {formik.touched.questionBody && formik.errors.questionBody && (
                  <div className="text-danger mt-2">{formik.errors.questionBody}</div>
                )}
                
              </div>

              <div className="fv-row mb-10">
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    {...formik.getFieldProps("required")}
                    checked={formik.values.required} // Ensure the value is controlled
                    onChange={(e) => formik.setFieldValue('required', e.target.checked)} // Update the value in formik
                  />
                  <label className="form-label mb-1 ms-2" htmlFor="flexCheckDefault">
                    Mandatory
                  </label>
                </div>
              </div>

              {(formik.values.questionType === 1 || formik.values.questionType === "1") &&(
                <div className="fv-row mb-10">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <label className="form-label mb-0">Create Multiple Choices</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-active-color-danger"
                      onClick={handleAddChoiceButton}
                    >
                      + Add Choice
                    </button>
                  </div>
                  {choices.map((choice, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between mb-2">
                      <span className="me-2">• {choice.body}</span>
                      <div>
                        <button
                          type="button"
                          className="btn btn-sm btn-active-color-danger p-2"
                          onClick={() => handleEditChoice(index)}
                        >
                          <KTIcon iconName="pencil" className="fs-5" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-active-color-danger p-2"
                          onClick={() => handleDeleteChoice(index)}
                        >
                          <KTIcon iconName="trash" className="fs-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {isAddingChoice && (
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        value={newChoice}
                        onChange={handleChoiceInputChange}
                        placeholder="Please add choice"
                      />
                      <button type="button" className="btn btn-light btn-sm" onClick={handleCancelChoice}>
                        Cancel
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={handleSaveChoice}>
                        Save
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="fv-row my-10 w-50">
                <label className="form-label required">Marks</label>
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...formik.getFieldProps("marks")}
                />
                {formik.touched.marks && formik.errors.marks && (
                  <div className="text-danger mt-2">{formik.errors.marks}</div>
                )}
              </div>
              
              {(formik.values.questionType != 3 || formik.values.questionType != "3" )&& (
              <div className="fv-row my-10 w-50">
                <label className="form-label required">Answer</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  {...formik.getFieldProps("answer")}
                />
                {formik.touched.answer && formik.errors.answer && (
                  <div className="text-danger mt-2">{formik.errors.answer}</div>
                )}
              </div>
              )}


              {(formik.values.questionType === 3 || formik.values.questionType === "3") && (
              <div className="fv-row my-10 w-50">
                <label className="form-label required">Video Duration</label>
                <div class="input-group mb-3">
                <input
                  type="number"
                  className="form-control form-control-solid"
                  {...formik.getFieldProps("videoDuration")}
                />
                  <span class="form-control form-control-solid text-end">minute/s</span>
                </div>
                {formik.touched.videoDuration && formik.errors.videoDuration && (
                  <div className="text-danger mt-2">{formik.errors.videoDuration}</div>
                )}
              </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export {EditQuestion};

import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
// import { Modal } from 'bootstrap';
import { createQuestion, listQuestionTypes } from '../../../core/requests/_request';
import Swal from 'sweetalert2';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock, Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Base64UploadAdapter,
  FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';

const questionSchema = Yup.object().shape({
  questionType: Yup.string().required('Required'),
  questionBody: Yup.string().required('Required'),
  marks: Yup.number().min(0, 'mark cannot be negative').required('Required'),
  answer: Yup.string().required('Required'),
  videoDuration: Yup.number().min(0, 'Video duration cannot be negative').required('Required'),
});

const CreateQuestion = ({onModalClose }) => {

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
  const [assessmentId, setAssessmentId] = useState(null);
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);

  const handleModalClose = () => {
    // Logic to close the modal (if applicable)
    onModalClose(); // Call the provided callback function
  };

  const handleHideModal = () => {
    
    // setCreating(true);
    const modalElement = document.getElementById('create-question');
    // const modalInstance = Modal.getInstance(modalElement);
    if (modalElement) {
      // Get the modal instance
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);

      if (modalInstance) {
      //     // Hide the modal using Bootstrap's API
          modalInstance.hide();
      //     // Fallback if modal instance isn't correctly initialized
      //     modalElement.classList.remove('show');
      //     modalElement.setAttribute('aria-hidden', 'true');
      //     modalElement.style.display = 'none';

      //     // Remove backdrop manually if any
      //     const backdrop = document.querySelector('.modal-backdrop');
      //     if (backdrop) {
      //         backdrop.parentNode.removeChild(backdrop);
      //     }          
        }
    }
  };
  
  const handleEditChoice = (index) => {
    setNewChoice(choices[index]);
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
        updatedChoices[editingIndex] = newChoice;
        setChoices(updatedChoices);
        setIsEditing(false);
        setEditingIndex(null);
      } else {
        setChoices([...choices, newChoice]);
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
      required: false,
      videoDuration: 0
    },
    validationSchema: questionSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const Answers = [{AnswerBody: values.answer}];
        const videoDurations = [{ VideoDurationMinute: values.videoDuration }];
        const Choices = (values.questionType === "1" || values.questionType === 1) ? choices.map(choice => ({ ChoiceBody: choice })) : null
        let res;
        res = await createQuestion(
          parseInt(assessmentId),
          values.questionBody,
          parseInt(values.questionType),  // Ensure this is integer
          values.required,
          parseInt(values.marks),
          Answers,  // Adjust key if it differs
          videoDurations,
          Choices, // Choice mapping
        );
        // onCreateQuestion(newQuestion); // Call the parent method to create a new question
        formik.resetForm();
        setChoices([]);
      } catch (error) {
        console.error(error);
        setStatus(error.response.data.title ||error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
        handleHideModal();
        formik.resetForm();
        handleModalClose();
        Swal.fire('Created', 'Question has been Created Successfully!', 'success');
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

    const modalElement = document.getElementById('create-question');
    // const modal = new Modal(modalElement);

    const handleModalShown = (event) => {
      const button = event.relatedTarget;
      const assessmentId = button.getAttribute('data-assessment-id');;
      setAssessmentId(assessmentId);
      fetchQuestionTypes();
    };

    // Add event listener when the modal is shown
    modalElement.addEventListener('shown.bs.modal', handleModalShown);
    modalElement.addEventListener('hidden.bs.modal', handleHideModal);

    return () => {
      // Clean up the event listener when the component unmounts or modal is no longer shown
      modalElement.removeEventListener('shown.bs.modal', handleModalShown);
      modalElement.removeEventListener('hidden.bs.modal', handleHideModal);
    };
  }, []);

  return (
    <div className="modal fade" id="create-question" aria-hidden="true">
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
                <h1 className="mb-3">Create Question</h1>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label required">Type</label>
                <select
                  className="form-select form-select-solid"
                  {...formik.getFieldProps("questionType")}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    formik.setFieldValue('questionType', selectedType);
                
                    if (selectedType === "3") {
                      formik.setFieldValue('answer', 'Video');
                      formik.setFieldValue('videoDuration', 0);
                    }
                    else{
                      formik.setFieldValue('answer', '');
                      formik.setFieldValue('videoDuration', 0);
                    }
                  }}
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

              {(formik.values.questionType === 1 || formik.values.questionType === "1")&& (
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
                      <span className="me-2">• {choice}</span>
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

              {/* <div className="fv-row my-10 w-50">
                <label className="form-label required">Answer</label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  {...formik.getFieldProps("answer")}
                />
                {formik.touched.answer && formik.errors.answer && (
                  <div className="text-danger mt-2">{formik.errors.answer}</div>
                )}
              </div> */}

              {(formik.values.questionType != "3" || formik.values.questionType != 3)&& (
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

              {(formik.values.questionType === "3" || formik.values.questionType === 3 )&& (
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

export {CreateQuestion};

import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
// import { Modal } from 'bootstrap';
import { listQuestionTypes } from '../../../core/requests/_request';
import Swal from 'sweetalert2';

const questionSchema = Yup.object().shape({
  questionType: Yup.string().required('Required'),
  questionBody: Yup.string().required('Required'),
  marks: Yup.number().min(0, 'mark cannot be negative').required('Required'),
  answer: Yup.string().required('Required'),
  videoDuration: Yup.number().min(0, 'Video duration cannot be negative').required('Required'),
});

const CreateEditQuestion = ({ onCreateQuestion, selectedQuestion, questions, isCreating }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Creating, setCreating] = useState(isCreating);
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);

  const handleHideModal = () => {
    formik.resetForm();
    setCreating(true);
    const modalElement = document.getElementById('create-question');
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
        const newQuestion = {
          id: selectedQuestion ? selectedQuestion.id : questions.length + 1,
          body: values.questionBody,
          marks: values.marks,
          type: values.questionType,
          choices: values.questionType === "1" ? choices.map(choice => ({ choiceBody: choice })) : null,
          answers: [{ answerBody: values.answer }],
          videoDurations:[{ VideoDurationMinute: values.videoDuration }],
          required: values.required,
        };

        onCreateQuestion(newQuestion); // Call the parent method to create a new question
        setChoices([]);
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
        setLoading(false);
        handleHideModal();
        formik.resetForm();
        Swal.fire(`${editMode ? 'Updated' : 'Created'}`, `Question has been ${editMode ? 'Updated' : 'Created'} Successfully!`, 'success');
      }
    },
  });

  // Fetch question types when the component mounts
  useState(() => {
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



    fetchQuestionTypes();
  }, []);


  useEffect(() => {

    const modalElement = document.getElementById('create-question');
    // const modal = new Modal(modalElement);

    const handleModalShown = (event) => {
      const button = event.relatedTarget;
      const edit = button.getAttribute('data-edit') === 'true';
      if (selectedQuestion) {
        formik.setValues({
          questionType: selectedQuestion.type || '',
          questionBody: selectedQuestion.body || '',
          marks: selectedQuestion.marks || '',
          answer: selectedQuestion.answers?.[0]?.answerBody || '',
          required: selectedQuestion.required || false,
          videoDuration: selectedQuestion.videoDurations?.[0]?.VideoDurationMinute || 0,
        });

        if (selectedQuestion.choices) {
          setChoices(selectedQuestion.choices.map(choice => choice.choiceBody) || []);
        }
      }
      setEditMode(edit);
      setCreating(Creating);
    };

    // Add event listener when the modal is shown
    modalElement.addEventListener('shown.bs.modal', handleModalShown);
    modalElement.addEventListener('hidden.bs.modal', handleHideModal);

    return () => {
      // Clean up the event listener when the component unmounts or modal is no longer shown
      modalElement.removeEventListener('shown.bs.modal', handleModalShown);
      modalElement.removeEventListener('hidden.bs.modal', handleHideModal);
    };
  }, [selectedQuestion]);

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
                <h1 className="mb-3">{editMode ? 'Edit' : 'Create'} Question</h1>
              </div>

              <div className="fv-row mb-10">
                <label className="form-label required">Type</label>
                <select
                  className="form-select form-select-solid"
                  {...formik.getFieldProps("questionType")}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    formik.setFieldValue('questionType', selectedType);
                
                    if (selectedType === '3') {
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
                <textarea
                  className="form-control form-control-solid mb-3"
                  rows={3}
                  placeholder="Type a question"
                  {...formik.getFieldProps("questionBody")}
                ></textarea>
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
                    onChange={(e) => formik.setFieldValue('required', e.target.checked)}
                  />
                  <label className="form-label mb-1 ms-2" htmlFor="flexCheckDefault">
                    Mandatory
                  </label>
                </div> 
              </div>

              {formik.values.questionType === "1" && (
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

              {formik.values.questionType != "3" && (
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

              {formik.values.questionType === "3" && (
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

export {CreateEditQuestion};

import React, { forwardRef, useEffect, useState } from 'react';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/_metronic/components/ui/dialog';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock,FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { listQuestionTypes } from '../../core/requests/_request';
import Swal from 'sweetalert2';
import { DialogActions } from '@mui/material';
import { useViewport } from '@/_metronic/hooks';

const questionSchema = Yup.object().shape({
  questionType: Yup.string().required('Required'),
  questionBody: Yup.string().required('Required'),
  marks: Yup.number().min(0, 'mark cannot be negative').required('Required'),
  answer: Yup.string().required('Required'),
  videoDuration: Yup.number().min(0, 'Video duration cannot be negative').required('Required'),
});

const AddQuestion = forwardRef(({
  open,
  onOpenChange,
  isCreating,
  selectedQuestion,
  onCreateQuestion,
  questions
}, ref) => {
  const [scrollableHeight, setScrollableHeight] = useState(0);
    const [viewportHeight] = useViewport();
    
    const offset = 200;
    useEffect(() => {
      setScrollableHeight(viewportHeight - offset);
    }, [viewportHeight]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Creating, setCreating] = useState(isCreating);
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);

  const CKEditorConfig = {
    licenseKey: 'GPL',
        plugins: [
            Essentials, Bold, Italic, Paragraph, List, Heading, Link,
            Table, TableToolbar, Indent, IndentBlock,FontSize 
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

  const handleHideModal = () => {
    formik.resetForm();
    setCreating(true);
    onOpenChange()
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
        // Swal.fire(`${editMode ? 'Updated' : 'Created'}`, `Question has been ${editMode ? 'Updated' : 'Created'} Successfully!`, 'success');
      }
    },
  });

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

    const handleModalShown = () => {
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
      setCreating(Creating);
    };



    return () => {
    handleModalShown()
    };
  }, [selectedQuestion]);

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] top-[2%] translate-y-0  " ref={ref}>
        <DialogHeader className="py-4">
        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
        {editMode ? 'Edit' : 'Create'} Question
        </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className='' >
        <DialogBody className=" p-5 items-center scrollable-y-auto min-h-9/10" style={{
            maxHeight: `${scrollableHeight}px`
          }}>
            
              {formik.status && (
                <div className="mb-lg-10 alert alert-danger">
                  <div className="alert-text font-weight-bold">{formik.status}</div>
                </div>
              )}
              <div className="w-full mb-5 px-5">
              {/* <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5"> */}
                <label className="form-label max-w-32">
                Question Type: 
                </label>
                <select
                  className="select select-sm"
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
                
              {/* </div> */}
              {formik.touched.questionType && formik.errors.questionType && (
                  <div className="text-danger text-xs">{formik.errors.questionType}</div>
                )}
              </div>

              <div className="px-5 mb-5">
                <label className="form-label required">Question</label>
                {/* <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Type a question"
                  {...formik.getFieldProps("questionBody")}
                ></textarea> */}
                <CKEditor
                  editor={ClassicEditor}
                  config={CKEditorConfig}
                  data={formik.values.questionBody}
                  onChange={(event, editor) => {
                      formik.setFieldValue('questionBody', editor.getData());
                  }}
                />               
                {formik.touched.questionBody && formik.errors.questionBody && (
                  <div className="text-danger text-xs">{formik.errors.questionBody}</div>
                )}
              </div>

              <div className="px-5 flex-col items-start gap-4 mb-5">
                <label className="form-label flex items-center gap-2.5">
                  <input className="checkbox"
                    type="checkbox"
                    id="flexCheckDefault"
                    {...formik.getFieldProps("required")}
                    checked={formik.values.required} // Ensure the value is controlled
                    onChange={(e) => formik.setFieldValue('required', e.target.checked)}
                  />
                  Mandatory
                </label>
              </div>                 

              {formik.values.questionType === "1" && (
                <div className="w-full my-5 px-5">
                  <div className="flex justify-between">
                    <label className="form-label max-w-32">Multiple Choices</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger btn-clear"
                      onClick={handleAddChoiceButton}
                    >
                      + Add Choice
                    </button>
                  </div>
                  {choices.map((choice, index) => (
                    <div key={index} className="flex items-center justify-between my-2">
                      <span className="me-2">• {choice}</span>
                      <div className=''>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-outline btn-clear btn-light"
                          onClick={() => handleEditChoice(index)}
                        >
                          <KTIcon iconName="pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-outline btn-clear btn-light" 
                          onClick={() => handleDeleteChoice(index)}
                        >
                          <KTIcon iconName="trash" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {isAddingChoice && (
                    <div className="input-group my-2">
                      <input
                        type="text"
                        className="input input-sm"
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

              <div className="my-5 px-5">
                <label className="form-label required">Marks</label>
                <input
                  type="number"
                  className="input input-sm"
                  {...formik.getFieldProps("marks")}
                />
                {formik.touched.marks && formik.errors.marks && (
                  <div className="text-danger text-xs">{formik.errors.marks}</div>
                )}
              </div>

              {formik.values.questionType != "3" && (
              <div className="my-5 px-5">
                <label className="form-label required">Answer</label>
                {/* <input
                  type="text"
                  className="input input-sm"
                  {...formik.getFieldProps("answer")}
                /> */}
                <textarea
                  className="textarea"
                  rows={3}
                  {...formik.getFieldProps("answer")}
                ></textarea>
                {formik.touched.answer && formik.errors.answer && (
                  <div className="text-danger text-xs">{formik.errors.answer}</div>
                )}
              </div>
              )}

              {formik.values.questionType === "3" && (
              <div className="px-5">
              <>
                <label className="form-label required">Video Duration</label>
                <div className="input-group mb-3">
                <input
                  type="number"
                  className="input input-sm"
                  {...formik.getFieldProps("videoDuration")}
                />
                  <span className="btn btn-input btn-sm">
                    minute/s
                  </span>
                </div>
                {formik.touched.videoDuration && formik.errors.videoDuration && (
                  <div className="text-danger mt-2">{formik.errors.videoDuration}</div>
                )}
                </>
              </div>
              )}
            
        </DialogBody>
        <DialogActions>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>              
        </DialogActions>
        </form>
      </DialogContent>
    </Dialog>;
});
export { AddQuestion };
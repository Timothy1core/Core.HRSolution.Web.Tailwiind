import { forwardRef, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/_metronic/components/ui/dialog';
import { DialogActions } from '@mui/material';
import { listQuestionTypes, updateQuestion } from '../../../core/requests/_request';
import Swal from 'sweetalert2';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock, Image, FontSize  } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import { useViewport } from '@/_metronic/hooks';

const questionSchema = Yup.object().shape({
  questionType: Yup.string().required('Required'),
  questionBody: Yup.string().required('Required'),
  marks: Yup.number().min(0, 'mark cannot be negative').required('Required'),
  answer: Yup.string().required('Required'),
  videoDuration: Yup.number().min(0, 'Video duration cannot be negative').required('Required'),
});

const EditQuestion = forwardRef(({
  open,
  onOpenChange,
  selectedQuestion
}, ref) => {
  const CKEditorConfig = {
    licenseKey: 'GPL',
    plugins: [
        Essentials, Bold, Italic, Paragraph, List, Heading, Link,
        Table, TableToolbar, Indent, IndentBlock, Image, FontSize 
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
  const [viewportHeight] = useViewport();
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionId, setQuestionId] = useState(null);

  useEffect(() => {
        setScrollableHeight(viewportHeight - 200);
      }, [viewportHeight]);

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
        onOpenChange()
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
      if (selectedQuestion) {
        formik.setValues({
          questionType: selectedQuestion.type || '',
          questionBody: selectedQuestion.body || '',
          marks: selectedQuestion.marks || '',
          answer: selectedQuestion.assessmentAnswers?.[0]?.answerBody || '',
          answerId: selectedQuestion.assessmentAnswers?.[0]?.id || null,
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
  }, [selectedQuestion]);

  // return (
  //   <div className="modal fade" id="edit-question" aria-hidden="true">
  //     <div className="modal-dialog mw-650px">
  //       <div className="modal-content">
  //         <div className="modal-header pb-0 border-0 justify-end">
  //           <div className="btn btn-sm btn-icon btn-active-color-danger" data-bs-dismiss="modal" onClick={handleHideModal}>
  //             <KTIcon iconName="cross" className="fs-1" />
  //           </div>
  //         </div>

  //         <div className="modal-body mx-5 mx-xl-18 pt-0 pb-5">
  //           <form onSubmit={formik.handleSubmit}>
  //             {formik.status && (
  //               <div className="mb-lg-10 alert alert-danger">
  //                 <div className="alert-text font-weight-bold">{formik.status}</div>
  //               </div>
  //             )}
  //             <div className="text-center mb-13">
  //               <h1 className="mb-3">Edit Question</h1>
  //             </div>

  //             <div className="fv-row mb-10">
  //               <label className="form-label required">Type</label>
  //               <select
  //                 className="form-select form-select-solid"
  //                 {...formik.getFieldProps("questionType")}
  //               >
  //                 <option value="" hidden>Select Question Types</option>
  //                 {questionTypes.map((questionType) => (
  //                   <option key={questionType.id} value={questionType.id}>
  //                     {questionType.typeName}
  //                   </option>
  //                 ))}
  //               </select>
  //               {formik.touched.questionType && formik.errors.questionType && (
  //                 <div className="text-danger mt-2">{formik.errors.questionType}</div>
  //               )}
  //             </div>

  //             <div className="fv-row mb-10">
  //               <label className="form-label required">Question</label>
  //               <CKEditor
  //                             editor={ClassicEditor}
  //                             config={CKEditorConfig}
  //                             data={formik.values.questionBody}
  //                             onChange={(event, editor) => {
  //                                 formik.setFieldValue('questionBody', editor.getData());
  //                             }}
  //                           /> 
  //               {formik.touched.questionBody && formik.errors.questionBody && (
  //                 <div className="text-danger mt-2">{formik.errors.questionBody}</div>
  //               )}
                
  //             </div>

  //             <div className="fv-row mb-10">
  //               <div className="form-check form-check-custom form-check-solid">
  //                 <input
  //                   className="form-check-input"
  //                   type="checkbox"
  //                   id="flexCheckDefault"
  //                   {...formik.getFieldProps("required")}
  //                   checked={formik.values.required} // Ensure the value is controlled
  //                   onChange={(e) => formik.setFieldValue('required', e.target.checked)} // Update the value in formik
  //                 />
  //                 <label className="form-label mb-1 ms-2" htmlFor="flexCheckDefault">
  //                   Mandatory
  //                 </label>
  //               </div>
  //             </div>

  //             {(formik.values.questionType === 1 || formik.values.questionType === "1") &&(
  //               <div className="fv-row mb-10">
  //                 <div className="d-flex align-items-center justify-between mb-3">
  //                   <label className="form-label mb-0">Create Multiple Choices</label>
  //                   <button
  //                     type="button"
  //                     className="btn btn-sm btn-active-color-danger"
  //                     onClick={handleAddChoiceButton}
  //                   >
  //                     + Add Choice
  //                   </button>
  //                 </div>
  //                 {choices.map((choice, index) => (
  //                   <div key={index} className="d-flex align-items-center justify-between mb-2">
  //                     <span className="me-2">• {choice.body}</span>
  //                     <div>
  //                       <button
  //                         type="button"
  //                         className="btn btn-sm btn-active-color-danger p-2"
  //                         onClick={() => handleEditChoice(index)}
  //                       >
  //                         <KTIcon iconName="pencil" className="fs-5" />
  //                       </button>
  //                       <button
  //                         type="button"
  //                         className="btn btn-sm btn-active-color-danger p-2"
  //                         onClick={() => handleDeleteChoice(index)}
  //                       >
  //                         <KTIcon iconName="trash" className="fs-5" />
  //                       </button>
  //                     </div>
  //                   </div>
  //                 ))}
  //                 {isAddingChoice && (
  //                   <div className="input-group mb-3">
  //                     <input
  //                       type="text"
  //                       className="form-control form-control-solid"
  //                       value={newChoice}
  //                       onChange={handleChoiceInputChange}
  //                       placeholder="Please add choice"
  //                     />
  //                     <button type="button" className="btn btn-light btn-sm" onClick={handleCancelChoice}>
  //                       Cancel
  //                     </button>
  //                     <button type="button" className="btn btn-danger btn-sm" onClick={handleSaveChoice}>
  //                       Save
  //                     </button>
  //                   </div>
  //                 )}
  //               </div>
  //             )}

  //             <div className="fv-row my-10 w-50">
  //               <label className="form-label required">Marks</label>
  //               <input
  //                 type="number"
  //                 className="form-control form-control-solid"
  //                 {...formik.getFieldProps("marks")}
  //               />
  //               {formik.touched.marks && formik.errors.marks && (
  //                 <div className="text-danger mt-2">{formik.errors.marks}</div>
  //               )}
  //             </div>
              
  //             {(formik.values.questionType != 3 || formik.values.questionType != "3" )&& (
  //             <div className="fv-row my-10 w-50">
  //               <label className="form-label required">Answer</label>
  //               <input
  //                 type="text"
  //                 className="form-control form-control-solid"
  //                 {...formik.getFieldProps("answer")}
  //               />
  //               {formik.touched.answer && formik.errors.answer && (
  //                 <div className="text-danger mt-2">{formik.errors.answer}</div>
  //               )}
  //             </div>
  //             )}


  //             {(formik.values.questionType === 3 || formik.values.questionType === "3") && (
  //             <div className="fv-row my-10 w-50">
  //               <label className="form-label required">Video Duration</label>
  //               <div class="input-group mb-3">
  //               <input
  //                 type="number"
  //                 className="form-control form-control-solid"
  //                 {...formik.getFieldProps("videoDuration")}
  //               />
  //                 <span class="form-control form-control-solid text-end">minute/s</span>
  //               </div>
  //               {formik.touched.videoDuration && formik.errors.videoDuration && (
  //                 <div className="text-danger mt-2">{formik.errors.videoDuration}</div>
  //               )}
  //             </div>
  //             )}

  //             <div className="text-center">
  //               <button
  //                 type="submit"
  //                 className="btn btn-danger"
  //                 disabled={loading || formik.isSubmitting}
  //               >
  //                 {loading ? 'Saving...' : 'Submit'}
  //               </button>
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-[600px] top-[2%] translate-y-0  " ref={ref}>
            <DialogHeader className="py-4">
            <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
            Edit Question
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
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
        </Dialog>
  );
});

export {EditQuestion};

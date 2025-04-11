import { Content } from '../../../../../_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createAssessment ,listQuestionTypes } from '../core/requests/_request';
import { CreateEditQuestion } from '../components/modals/create-edit-question/CreateEditQuestion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock,FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import { AddQuestion } from '../components/modals/AddQuestion';



const assessmentSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  instructionBody: Yup.string().required('Required'),
  // description: Yup.string().required('Required'),
  duration: Yup.number().required('Required'),
  // answer: Yup.string().required('Required'),
});


const CreateAssessmentPage = () => {

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

    // const [name, setName] = useState('Name'); // Create a state variable for 'Name'
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const navigate = useNavigate();
    const [questionTypes, setQuestionTypes] = useState([]);
    const [addQuestionOpen, setModalOpen] = useState(false);
      const handleModalOpen = () => setModalOpen(true);
      const handleModalClose = () => {
        setModalOpen(false);
      };

    const handleAddQuestion = (newQuestions) => {
      if (selectedQuestion){
        setQuestions((prevQuestions) => {
          if (selectedQuestion) {
            // If editing, update the specific question
            return prevQuestions.map((q) =>
              q.id === selectedQuestion.id ? { ...q, ...newQuestions } : q
            );
          }
          return [...prevQuestions];
        });
        setSelectedQuestion(null);
      }
      else {
        setQuestions((prevQuestions) => [
          ...prevQuestions,  // Spread the existing questions
          newQuestions,   // Add the new questions
        ]);
      } 
    };



    const handleEditQuestion = (question) => {
      setSelectedQuestion(question); 
    };

    const handleDeleteQuestion = (id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this question?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          setQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question.id !== id)
          );
          Swal.fire('Deleted!', 'The question has been deleted.', 'success');
        }
      });
    };

    const formik = useFormik({
      initialValues: { 
        name: 'Name',
        instructionBody: '',
        description:'',
        duration: ''
       },
      validationSchema: assessmentSchema,
      validateOnChange: false,
      validateOnBlur: true,
      onSubmit: async (values, { setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          let res;
          // if (editMode) {
          //   res = await updateApi(apiId, values.apiName); // Update if editMode is true
          // } else {
            res = await createAssessment(
              values.name, values.duration, 
              values.instructionBody, 
              values.description, 
              questions); // Create if editMode is false
          // }
          
          if (res.data.success) {
            Swal.fire('Created', 'Assessment Created Successfully!', 'success');
            navigate('/recruitment/assessmentManagement');
            formik.resetForm();
          }
        } catch (error) {
          console.log(error.response.data.title)
          console.error(error.response.data.title);
          setStatus(error.response.data.title ||error.message || 'An error occurred');
        } finally {
          setSubmitting(false);
          setLoading(false);
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
      fetchQuestionTypes();
    }, []);

  return(
  <>
    <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
      <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <button href='/recruitment/assessmentManagement' className='btn btn-sm btn-danger'>
            <KTIcon iconName='entrance-right' className='fs-2' />
              Back to Assessment Dashboard
            </button>
        </div>
      </div>
    </div>
    <Content>
    <form onSubmit={formik.handleSubmit}>
              {formik.status && (
                <div className='mb-lg-10 alert alert-danger'>
                  <div className='text-danger font-bold'>{formik.status}</div>
                </div>
              )}
      <input 
        type="text" 
        className="form-control form-control-flush form-control-lg ps-1 fs-2" 
        onChange={(e) => setName(e.target.value)} // Update state when input changes
        {...formik.getFieldProps('name')}
      />
      {formik.touched.assessmentName && formik.errors.assessmentName && (
                      <div className='text-danger mt-2'>{formik.errors.assessmentName}</div>
                    )}

      {/* <div className='mb-5 mb-xl-8 px-2 py-0 '> */}
        {/* <TableWithPagination data={filteredData} columns={columns} /> */}
        <div className="flex gap-2">
          <div className="w-32 flex-auto card p-2">
            <label className='form-label required ms-1'>Instructions</label>
              {/* <textarea
                className='form-control form-control mb-3'
                rows={5}
                data-kt-element='input'
                placeholder='Type an instruction'
                {...formik.getFieldProps('instructionBody')}
              ></textarea> */}
              <CKEditor
                editor={ClassicEditor}
                config={CKEditorConfig}
                data={formik.values.instructionBody}
                onChange={(event, editor) => {
                    formik.setFieldValue('instructionBody', editor.getData());
                }}
              /> 
              {formik.touched.instructionBody && formik.errors.instructionBody && (
                      <div className='text-danger text-xs'>{formik.errors.instructionBody}</div>
                    )}  
              <div className="border-t mt-7 mb-5"></div>
              <label className='form-label'>Description</label>
              <CKEditor
                editor={ClassicEditor}
                config={CKEditorConfig}
                data={formik.values.description}
                onChange={(event, editor) => {
                    formik.setFieldValue('description', editor.getData());
                }}
              />      
              <div className="border-t mt-7 mb-5"></div>        
                {/* <textarea
                  className='form-control form-control mb-3'
                  rows={5}
                  data-kt-element='input'
                  placeholder='Type a description'
                  {...formik.getFieldProps('description')}
                ></textarea> */}
              {/* {formik.touched.description && formik.errors.description && (
                      <div className='text-danger mt-2'>{formik.errors.description}</div>
                    )}        */}
              <label className='form-label required '>Duration</label>
                  <div className="input-group mb-3">
                  <input
                    type='number'
                    className='input input-sm mb-3'
                    placeholder='Please enter duration'
                    {...formik.getFieldProps('duration')}
                    ></input>
                    <span className="btn btn-input btn-sm">
                    minute/s
                    </span>
                  </div>
                  {formik.touched.duration && formik.errors.duration && (
                      <div className='text-danger text-xs'>{formik.errors.duration}</div>
                    )}  
          </div>
          <div className="w-64 flex-auto card p-2">
              <div className="flex justify-between">
                {/* <label className='form-label text-start mb-0 pt-1'>Questions</label> */}
                <label className="form-label max-w-32">Questions</label>
                {/* <a 
                  href='#'
                  data-bs-toggle='modal'
                  data-bs-target='#create-question'
                  data-edit='false'
                  className='btn btn-sm btn-light-danger p-1 mb-1 pe-2 pt-1'
                >
                  
                </a> */}
                {/* <button onClick={handleSearchModalOpen} className="btn btn-icon btn-dark btn-icon-lg size-8 hover:text-primary">
                            <KTIcon iconName="magnifier" />
                          </button> */}

                <button className="btn btn-xs btn-danger" onClick={handleModalOpen}>
                  <KTIcon iconName="plus-squared" />
                  Add Question
                </button>
                
              </div>                      
                {questions.length == 0 ?
                <></>
                : 
                <div className='card p-2 mt-2'>
                {questions.map((question, index) => (
                  <div class="grid grid-cols-4 gap-4" key={question.id}>
                    <div class="col-span-4 grid grid-cols-subgrid gap-4">
                      <div class="col-start-4 text-sm text-end">
                        {questionTypes.find((qt) => qt.id == question.type)?.typeName || "Unknown Type"}
                      </div>
                    </div>
                    <div class="col-span-3 grid grid-cols-subgrid gap-4">
                      <div class="col-start-1 text-sm">
                        <span className='font-bold'>{index + 1}.</span> {question.body.length > 100 ? `${question.body.substring(0, 100)}...` : question.body}
                      </div>
                    </div>
                    <div class="col-span-1 grid grid-cols-subgrid gap-4">
                      <div class="col-start-1 text-end">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          type="button"
                          className='btn btn-sm btn-icon btn-outline btn-clear btn-light'
                        >
                          <KTIcon iconName='pencil'/>
                        </button>   
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className='btn btn-sm btn-icon btn-outline btn-clear btn-light'
                          data-id={question.id}
                        >
                          <KTIcon iconName='trash'/>
                        </button>                                
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
                }
                
          </div>
        </div>
        
        <div className="flex justify-end mt-5">
          <button
            type='submit'
            className='btn btn-danger'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>Submit</span>}
                  {loading && (
                    <span className='indicator-progress' style={{ display: 'block' }}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}      
          </button>
        </div>   
      {/* </div> */}
    {/* </div> */}
    </form>
    </Content>
    <AddQuestion
      onCreateQuestion={handleAddQuestion}
      selectedQuestion={selectedQuestion}
      questions={questions}
      isCreating={true}
      open={addQuestionOpen}
      onOpenChange={handleModalClose}
    />
        {/* <EditQuestion 
        onEditQuestion={handleEditQuestion} 
        selectedQuestion={selectedQuestion} 
        /> */}
  </>
  )
}

const CreateAssessment = () => {
  return (
    <>
      <CreateAssessmentPage />
    </>
  )
}

export { CreateAssessment }

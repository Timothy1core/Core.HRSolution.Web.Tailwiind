import { Content } from '../../../../../_metronic/layout/components/content'
import { KTIcon } from '@/_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createAssessment ,listQuestionTypes } from '../core/requests/_request';
import { CreateEditQuestion } from '../components/modals/create-edit-question/CreateEditQuestion';
import { useNavigate } from 'react-router-dom';
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



const assessmentSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  instructionBody: Yup.string().required('Required'),
  // description: Yup.string().required('Required'),
  duration: Yup.number().required('Required'),
  // answer: Yup.string().required('Required'),
});


const CreateAssessmentPage = () => {

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
    // const [name, setName] = useState('Name'); // Create a state variable for 'Name'
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const navigate = useNavigate();
    const [questionTypes, setQuestionTypes] = useState([]);

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
            <a href='/recruitment/assessmentManagement' className='btn btn-sm btn-light-danger'>
            <KTIcon iconName='entrance-right' className='fs-2' />
              Back to Assessment Dashboard
            </a>
        </div>
      </div>
    </div>
    <Content>
    <form onSubmit={formik.handleSubmit}>
              {formik.status && (
                <div className='mb-lg-10 alert alert-danger'>
                  <div className='alert-text font-weight-bold'>{formik.status}</div>
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

      <div className='mb-5 mb-xl-8 px-2 py-0 '>
        {/* <TableWithPagination data={filteredData} columns={columns} /> */}
        <div class="row">
            <div class="col-4 border border-dark border-right-0 py-2">
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
                    <div className='text-danger mt-2'>{formik.errors.instructionBody}</div>
                  )}  
            <label className='form-label ms-1 mt-5'>Description</label>
            <CKEditor
              editor={ClassicEditor}
              config={CKEditorConfig}
              data={formik.values.description}
              onChange={(event, editor) => {
                  formik.setFieldValue('description', editor.getData());
              }}
            />                          
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
            <label className='form-label required mt-5'>Duration</label>
                <div class="input-group mb-3">
                <input
                  type='number'
                  className='form-control mb-3'
                  placeholder='Please enter duration'
                  {...formik.getFieldProps('duration')}
                  ></input>
                  <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon2">minute/s</span>
                  </div>
                </div>
                {formik.touched.duration && formik.errors.duration && (
                    <div className='text-danger mt-2'>{formik.errors.duration}</div>
                  )}    
            </div>
            <div class="col-8 border border-dark py-2">
              <div class="d-flex justify-content-between">
                <label className='form-label text-start mb-0 pt-1'>Questions</label>
                <a 
                  href='#'
                  data-bs-toggle='modal'
                  data-bs-target='#create-question'
                  data-edit='false'
                  className='btn btn-sm btn-light-danger p-1 mb-1 pe-2 pt-1'
                >
                  <KTIcon iconName='plus' className='fs-2' />
                  Add Question
                </a>
              </div>                      
                <div>
                    {questions.map((question, index) => (
                        <div key={question.id} className=" form-control mb-2 p-2">
                            <table className="table mb-0">
                            <thead>
                              {/* Add a new header or text row */}
                              <tr>
                                <th colSpan="3" className="text-end p-0 text-muted fs-7">
                                  {questionTypes.find((qt) => qt.id == question.type)?.typeName || "Unknown Type"}
                                </th>
                              </tr>
                            </thead>
                              <tbody>
                                <tr>
                                  <td style={{ width: '1%' }} className="align-middle align-items-center ps-1">
                                    <div className="d-flex align-items-center">
                                      {/* <input type="checkbox" id={`checkbox-${question.id}`} className="me-2" /> */}
                                      <span className='fs-5'>{index + 1}.</span>
                                    </div>
                                  </td>
                                  <td className="align-middle align-items-center" >
                                    <span className='fs-5'>
                                      {question.body.length > 100 ? `${question.body.substring(0, 100)}...` : question.body}
                                    </span>
                                  </td>
                                  <td className='align-middle align-items-center text-end'>
                                    <div className='d-flex justify-content-end flex-shrink-0'>
                                        <button
                                          onClick={() => handleEditQuestion(question)}
                                          type="button"
                                          className='btn btn-sm me-1 p-0 btn-active-color-danger'
                                          data-bs-toggle='modal'
                                          data-bs-target='#create-question'
                                          data-edit='true'
                                        >
                                          <KTIcon iconName='pencil' className='fs-5' />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteQuestion(question.id)}
                                          className='btn btn-sm p-0 btn-active-color-danger'
                                          data-id={question.id}
                                        >
                                          <KTIcon iconName='trash' className='fs-5' />
                                        </button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-end mt-5">
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
      </div>
    {/* </div> */}
    </form>
    </Content>
        <CreateEditQuestion
          onCreateQuestion={handleAddQuestion}
          selectedQuestion={selectedQuestion}
          questions={questions}
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

import React, { useState,useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { infoAssessments, ApiGateWayUrl } from '../core/requests/_request';
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
  Indent,
  IndentBlock,
  FontSize
} from "ckeditor5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";



const CandidateAssessments = () => {
    const CKEditorConfig = {
        plugins: [
          Essentials,
          Bold,
          Italic,
          Paragraph,
          List,
          Heading,
          Link,
          Table,
          TableToolbar,
          Indent,
          IndentBlock,
          Image,
          FontSize,
        ],
        toolbar: [
          'undo', 'redo', '|',
          'heading', '|',
          'bulletedList', 'numberedList', '|',
          'bold', 'italic', '|',
          'insertTable', '|', 'indent', 'outdent', 'fontSize',
      ],
        removePlugins: ["Toolbar"],
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
        viewportTopOffset: 60,
      };

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [candidateId, setCandidateId] = useState();

    useEffect(() => {
               if (id) setCandidateId(id);
             }, [id]);
    const fetchData = useCallback(async () => {
        try {
            const response = await infoAssessments(id);
            if (response?.data) {
                setData(response.data);
            } 
        } catch (err) {
            navigate(`/error/400`);
        }
    }, [id]);

    useEffect(() => {
        if (candidateId) {
            fetchData(candidateId);
        }
    }, [candidateId]);        

    
    if (!data) {
        return (
            <div id="kt_app_content_container" className="app-container container-xxl">
                <div className="card">
                    <div className="card-body">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div
            id="kt_app_content_container"
            className="app-container container-xxl d-flex justify-content-center align-items-center"
        >
            <div className="card w-100">
                <div className="card-body py-10">
                    <div className=" text-gray-700">
                        <h3>Candidate Name: {data.candidateName}</h3>
                        <h3>Position: {data.jobName}</h3>
                    </div>
                    <div className="separator border-secondary my-5"></div>
                        <div className="row">
                            <div className="col-sm-12 mt-0">
                                {data.assessmentInfo.map((info, index) => (
                                <div key={index}>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <h4 className="card-title">Assessment Name: {info.assessmentName}</h4>
                                        <h3 className='p-3 border border-danger rounded bg-light-danger'>{(info.correctCount / info.totalQuestions * 100).toFixed(0)}/100</h3>
                                    </div>
                                    
                                    {info.assessmentDetails.map((questionDetail, index1) => (
                                    <div className="card mb-2 p-5" key={index1}>
                                        <div className="d-flex gap-2">
                                        <div className='ck-editor-bordered w-50'>
                                        Question:
                                        <CKEditor 
                                           disabled
                                           editor={ClassicEditor} 
                                           config={CKEditorConfig} 
                                           data={questionDetail.questionBody} 
                                        />                     
                                        </div>
                                        <div className='w-50'>
                                            <div>
                                            Answer:
                                            </div>
                                            {questionDetail.answerBody == "video"
                                            ?
                                                <div className="position-relative d-flex mb-2 w-100 h-100 justify-content-center">
                                                    <iframe className="w-100 rounded border"
                                                        style={{ maxWidth: "600px", height: "350px" }}
                                                        src={`${ApiGateWayUrl()}/assessment/assessmentauth/candidate_video_answer/${questionDetail.id}`}
                                                    />
                                                </div>
                                            :
                                                questionDetail.answerBody
                                            }

                                        {/* {questionDetail.answerBody} */}
                                        {/* <div> */}
                                        {questionDetail.answerBody != "video"?
                                            questionDetail.isCorrect?<span className='text-success ms-2'>Correct</span>:<span className='text-danger ms-2'>Wrong</span>
                                            : null
                                        }
                                        {/* </div> */}
                                        </div>
                                        </div>
                                        
                                        {/* <div className="card-header">
                                        <h3 className="card-title">{questionDetail.answerBody}</h3>
                                        </div> */}
                                    </div>
                                    ))}
                                </div>
                                ))}
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};


export { CandidateAssessments };

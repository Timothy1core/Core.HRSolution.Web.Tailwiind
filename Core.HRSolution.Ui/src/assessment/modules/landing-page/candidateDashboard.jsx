//#region PACKAGE IMPORTS
import React, { useState, useEffect, useRef } from "react";

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
  Image,
  ImageCaption,
			ImageResize,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Base64UploadAdapter,
      FontSize
} from "ckeditor5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";

import { useFormik } from 'formik';
import * as Yup from 'yup';

import Webcam from "react-webcam";

import { render } from 'react-dom'
import { useAuth } from '../../../app/modules/auth'
//#endregion PACKAGE IMPORTS

//#region COMPONENT IMPORTS
import { HeaderWrapper } from "../components/header/HeaderWrapper";

import { KTIcon } from '@/_metronic/helpers';
import { toAbsoluteUrl } from '@/_metronic/utils';

import { Step1Div } from "../components/setup-steps/Step1";
import { Step2Div } from "../components/setup-steps/Step2";
import { Step3Div } from "../components/setup-steps/Step3";
import { Step4Div } from "../components/setup-steps/Step4";
import { CameraRecorder } from "../components/camera.recorder.for.question/CameraRecorder";
//#endregion COMPONENT IMPORTS

import { setIsStarted, setAssessmentFinished, setCurrentAssessment, submitAnswer, submitRemainingTimer, updateRemainingTimer, submitAssessmentDetails, setAssessmentMouseOut, submitSnapshot } from '../../requests/_request'



const answerSchema = Yup.object().shape({
  answer: Yup.string()
    .required('Required'),
});

const DashboardPage = () => {

  //#region INITIALIZATIONS
  const { currentUser } = useAuth()

  // Step management

  const [candidateCredential] = useState(currentUser.loggedCandidate.candidateCredentials[0]);
  const [currentStep, setCurrentStep] = useState(1); // Start with step 1
  const [isAssessment, setAssessment] = useState(candidateCredential.isAssessmentStarted);
  const [isAssessmentFinish, setAssessmentFinish] = useState(candidateCredential.isAssessmentFinished);


  const [startTime, setStartTime] = useState(null);
  const [isStart, setStart] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const [maxTime, setMaxTime] = useState(null);

  const [answeredQuestions, setAnsweredQuestions] = useState(null);

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
			ImageCaption,
			ImageResize,
			ImageStyle,
      FontSize,
			ImageToolbar,
			ImageUpload,
			Base64UploadAdapter,
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

  const candidateData = currentUser.loggedCandidate;

  const currentAssessmentId = currentUser.loggedCandidate.assessments.findIndex(
    (assessment) => assessment.id === candidateData.candidateCredentials[0].currentAssessmentId
  );
  
  const [currentAssessmentIndex, setCurrentAssessmentIndex] = useState(currentAssessmentId); // Track the current assessment index
  const [assessments, setAssessments] = useState(currentUser.loggedCandidate.assessments[currentAssessmentIndex]); // State for assessments
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState();
  const [hasRemainingTimer, setRemainingTimerBool] = useState(assessments.assessmentRemainingTimers.length === 0 ? false : true);
  const [isMouseInside, setIsMouseInside] = useState(true);

  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]); // Array to store snapshots
  const [devices, setDevices] = useState([]);
  
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const webcamRef = useRef(null);

  const [isCameraStarted, setCameraStarted] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [mouseLeaveCount, setMouseLeaveCount] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  //#endregion


  //#region  4Step Setup

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 4)); // Ensure max step is 4
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
         <Step1Div handleNext={handleNext} />
        );
      case 2:
        return (
          <Step2Div handleNext={handleNext} />
        );
      case 3:
        return (
          <Step3Div handleNext={handleNext} />
        );
      case 4:
        return (
          <Step4Div 
          handleStartAssessment={handleStartAssessment}
          // startCamera={handleImagesCapture}
          />
        );
      default:
        return null;
        // Ryzen zx550
    }
  };
  //#endregion

  //#region 10 SECONDS BEFORE START
  useEffect(() => {
    const fetchInitialTime = async () => {
      try {
        setStartTime(10)
        setCameraStarted(true);
      } catch (error) {
        console.error("Failed to fetch initial time:", error);
      }
    };
    fetchInitialTime();
  }, []);

  const setRandomUnansweredQuestion = (questions) => {
    const unansweredQuestions = questions.filter(
      (question) => question.assessmentAnswers.length === 0
    );

    const answeredQuestionsData = questions.filter(
      (question) => question.assessmentAnswers.length > 0
    );
    
    setAnsweredQuestions(answeredQuestionsData)
  
    if (unansweredQuestions.length > 0) {
      // Randomly select an index from unansweredQuestions
      const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
      
      // Find the index of the original question in the questions array
      const originalIndex = questions.indexOf(unansweredQuestions[randomIndex]);
  
      // Update the state with the original index
      setCurrentQuestionIndex(originalIndex);
    } else {
      handleNextAssessment()
    }
  };

  useEffect(() => {
    if (!isAssessment || startTime === null) {
      return; // Exit if conditions are not met
    }
    
    if (startTime <= 0) {

  
      setStart(true);
  
      setTimeLeft(
        hasRemainingTimer
          ? assessments.assessmentRemainingTimers[0].remainingTime * 60
          : assessments.duration * 60
      );
      setMaxTime(
        hasRemainingTimer
          ? assessments.assessmentRemainingTimers[0].remainingTime * 60
          : assessments.duration * 60
      );
  
      captureSnapshot();
      setRandomUnansweredQuestion(assessments.questions);
  
      const setCurrentAssessmentId = async () => {
        try {
          let res;
          res = await setCurrentAssessment(
            currentUser.loggedCandidate.candidateCredentials[0].id,
            assessments.id
          );
          if (res.data.success) {
            console.log("Assessment set successfully:", assessments.id);
          }
        } catch (error) {
          console.error("Error setting current assessment:", error);
        } finally {
          console.log("Assessment ID set process completed.");
        }
      };
      setCurrentAssessmentId();
      enterFullscreen();
      return;
    }
  
    const timer = setInterval(() => {
      setStartTime((prevTime) => prevTime - 1);
    }, 1000);
  
    return () => clearInterval(timer); // Cleanup on unmount
  }, [isAssessment, startTime]);
  
  // Debugging Hook for isCameraStarted
  useEffect(() => {
  }, [isCameraStarted]);
  //#endregion


  const handleMouseLeave = () => {
    setIsMouseInside(false);
    setMouseLeaveCount((prevCount) => prevCount + 1); // Increment the counter
  };

  const handleNextAssessment = async () => {

  
    // Check if there are remaining assessments
    if (currentAssessmentIndex < currentUser.loggedCandidate.assessments.length - 1) {
      const nextIndex = currentAssessmentIndex + 1;
      const nextAssessment = currentUser.loggedCandidate.assessments[nextIndex];
  
      // Update states synchronously
      setCurrentAssessmentIndex(nextIndex);
      setStart(false); // Reset start state
      setStartTime(10); // Reset countdown
      setAssessments(nextAssessment);
      setRemainingTimerBool(false)
      try {
        const res = await setCurrentAssessment(
          currentUser.loggedCandidate.candidateCredentials[0].id,
          nextAssessment.id
        );
        if (res.data.success) {

        }

        const res1 = await submitAssessmentDetails(
          currentUser.loggedCandidate.candidateCredentials[0].id,
          !isFullscreen,
          !isMouseInside
        );
        if (res1.data.success) {
          console.log('Assessment updated successfully:', currentUser.loggedCandidate.candidateCredentials[0].id,
            !isFullscreen,
            !isMouseInside);
        }

        const res2 = await setAssessmentMouseOut(
          currentUser.loggedCandidate.candidateCredentials[0].id,
          mouseLeaveCount
        );
        if (res2.data.success) {
          console.log('Assessment updated successfully:', currentUser.loggedCandidate.candidateCredentials[0].id,
            !isFullscreen,
            !isMouseInside);
        }

        
      } catch (error) {
        console.error('Error setting current assessment:', error);
      } finally {
        console.log('Assessment update process completed.');
      }
      setMouseLeaveCount(0)
    } else if (currentAssessmentIndex === currentUser.loggedCandidate.assessments.length - 1) {
      // Finish assessments
      setAssessmentFinish(true);
      updateAssessmentIsStarted();
      //save camera snapshots api
    }
  
    // Capture snapshot (if needed)
    captureSnapshot();
  };

  // Step navigation handlers
  const handleStartAssessment = () => {
    // setCurrentAssessmentIndex(0)
    
    
    setAssessment(true)
        const updateAssessmentIsStarted = async () => {
          try {
                  let res;
                    res = await setIsStarted(currentUser.loggedCandidate.candidateCredentials[0].id);
                  if (res.data.success) {
                    console.log('Assessment Started!')
                  }
                } catch (error) {
                  console.error(error);
                }
        };
        updateAssessmentIsStarted();
  }

  // Fetch initial time from endpoint




  // remaining timer monitoring
  useEffect(() => {
    if (timeLeft === null) return; // Wait until timeLeft is fetched
    if (timeLeft <= 0) {
      handleNextAssessment();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        // Log when timeLeft decreases by 60 seconds
        if (newTime % 60 === 0) {
          const updateTimeLeftFromDB = async () => {
            try {
                    let res;
                    if(!hasRemainingTimer || assessments.assessmentRemainingTimers === 0){
                      res = await submitRemainingTimer((newTime / 60), candidateData.candidateId, assessments.id);
                    }else{
                      res = await updateRemainingTimer(assessments.assessmentRemainingTimers[0].id, (newTime / 60));
                    }
                    if (res.data.success) {

                      setRemainingTimerBool(true);
                    }
                  } catch (error) {
                    console.error(error);
                  }
          };
          updateTimeLeftFromDB();
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Fullscreen functionality
  const enterFullscreen = () => {
    const elem = document.documentElement; // Fullscreen the whole page

    // Unified requestFullscreen logic with a fallback for prefixes
    const requestFullscreen =
      elem.requestFullscreen ||
      elem.webkitRequestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen;

    if (requestFullscreen) {
      requestFullscreen.call(elem)
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          console.error("Failed to enter fullscreen:", err);
        });
    } else {
      console.warn("Fullscreen API is not supported on this browser.");
    }
  };

  // Monitor fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check if the document is in fullscreen mode using unified detection
      const isInFullscreen =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement;

      setIsFullscreen(isInFullscreen);
    };

    // Add fullscreen change event listeners (modern and vendor-prefixed)
    const eventNames = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
    eventNames.forEach((eventName) =>
      document.addEventListener(eventName, handleFullscreenChange)
    );

    // Clean up the event listeners on component unmount
    return () => {
      eventNames.forEach((eventName) =>
        document.removeEventListener(eventName, handleFullscreenChange)
      );
    };
  }, []);

  //#region AVOIDING DEVELOPER TOOLS

  // Prevent right-click
  useEffect(() => {
    const preventRightClick = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", preventRightClick);

    return () => {
      document.removeEventListener("contextmenu", preventRightClick);
    };
  }, []);

  // Prevent keyboard shortcuts for dev tools (F12, Ctrl+Shift+I)
  useEffect(() => {
    const preventDevToolsShortcuts = (e) => {
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", preventDevToolsShortcuts);

    return () => {
      document.removeEventListener("keydown", preventDevToolsShortcuts);
    };
  }, []);

  // Detect developer tools open (basic method)
  useEffect(() => {
    const detectDevTools = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 500 || height < 400) {
        console.log("Developer Tools are open!");
        alert("Please do not open the developer tools.");
      }
    };

    window.addEventListener("resize", detectDevTools);

    return () => {
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);

  //#endregion AVOIDING DEVELOPER TOOLS


  useEffect(() => {
    const getDevices = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first camera
      }
    };

    getDevices();
    
  }, []);

  const captureSnapshot = async () => {
    if (webcamRef.current) {
      
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); // Save the captured image (optional)
      try {

        const response = await fetch(imageSrc);
        const blob = await response.blob();

        const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Format as YYYYMMDDTHHmmss

        const formData = new FormData();
        formData.append('CandidateId', candidateData.candidateId);
        formData.append('SnapshotFile', blob, `A${assessments?.id}_C${candidateData.candidateId}_${timestamp}.jpeg`);

        const res = await submitSnapshot(formData);
        
        if (res.data.success) {

          console.log('Snapshot Submitted!');
        }


      } catch (error) {
        console.error(error);
      }
    }
  };


  const updateAssessmentIsStarted = async () => {
    try {
            let res;
              res = await setAssessmentFinished(currentUser.loggedCandidate.candidateCredentials[0].id, currentUser.loggedCandidate.candidateCredentials[0].candidateId);
            if (res.data.success) {
              console.log('Assessment Finished!')
            }
          } catch (error) {
            console.error(error);
          }
  };    

  const handleVideoBlob = (blob) => {
    setVideoBlob(blob);
    formik.setFieldValue("answer", 'video')
  };

  const formik = useFormik({
    initialValues: { answer: '' },
    validationSchema: answerSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      // setLoading(true);
      try {
        const formData = new FormData();
        formData.append('AssessmentAnswerBody', values.answer);
        formData.append('CandidateId', candidateData.candidateId);
        formData.append('AssessmentId', assessments?.id);
        formData.append('Marks', assessments?.questions[currentQuestionIndex].marks);
        formData.append('Type', assessments?.questions[currentQuestionIndex].type);
        formData.append(
          'QuestionId',
          assessments?.questions[currentQuestionIndex].id
        );
        if(assessments?.questions[currentQuestionIndex].type === 3){
          formData.append('VideoFile', videoBlob, `video_q${assessments?.questions[currentQuestionIndex].id}_c${candidateData.candidateId}.webm`);
        }
      
        const res = await submitAnswer(formData);
        
        if (res.data.success) {
          // Create a new copy of assessments to ensure immutability
          const updatedAssessments = { ...assessments };
  
          // Update the assessmentAnswers array for the current question
          updatedAssessments.questions[currentQuestionIndex] = {
            ...updatedAssessments.questions[currentQuestionIndex],
            assessmentAnswers: [
              ...updatedAssessments.questions[currentQuestionIndex].assessmentAnswers, // Keep previous answers
              { 
                answer: values.answer, 
                candidateId: candidateData.candidateId 
              },
            ],
          };
  
          // Update the state with the modified assessments object
          setAssessments(updatedAssessments);       
          setRandomUnansweredQuestion(updatedAssessments.questions); // Re-fetch or update UI
          formik.setFieldValue("answer", '')
        }


      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        // setSubmitting(false);
        // setLoading(false);
      }
    },
  });
  return (
    <>
    <div
    onMouseLeave={handleMouseLeave}
    className="h-100 "
    >
      {
        isCameraStarted &&
      
      <Webcam
      style={{
        visibility: "hidden", /* Hides the element while keeping it in the DOM */
        position: "absolute", /* Removes it from the document flow but retains functionality */
        // width: 0,
        // height: 0,
        overflow: "hidden",
      }}
                className="border rounded"
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={490}
                height={368}
              
              />
            }
      <HeaderWrapper>
        {/* assessment header */}
        <div className="container d-flex justify-content-between align-items-center">
          <div className="page-title d-flex flex-column justify-content-center text-start flex-wrap w-50">
            {/* {isAssessment && */}
            <span className="card-label fw-bold fs-3">{currentUser?.loggedCandidate?.jobName} Exam</span>
            {/* } */}
            {isAssessment && isStart && !isAssessmentFinish && 
            <span className="text-muted mt-1 fw-semibold fs-7">{assessments.name}</span>
            }
          </div>
          {isAssessment && isStart &&  !isAssessmentFinish &&
          <div className="w-50 w-sm-100">
            
            <div className="d-flex w-100 align-items-center justify-content-center justify-content-md-center justify-content-sm-center justify-content-lg-end mb-2">
              <KTIcon iconName="timer" iconType="outline" className="fs-2 me-1 text-dark" />
              {/* Render Countdown Timer */}
              <div>{formatTime(timeLeft)}</div>
              <div
                className="progress w-50 ms-3"
                style={{ backgroundColor: "#e9e9e9", height: "10px" }}
              >
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <div className="d-flex w-100 align-items-center justify-content-center justify-content-md-center justify-content-sm-center justify-content-lg-end">
              <KTIcon iconName='note-2' iconType='outline' className='fs-2 me-1 text-dark' />
              <div>{answeredQuestions.length}/{assessments.questions.length}</div>
              <div className="progress w-50 ms-3" style={{ backgroundColor: "#e9e9e9",height: "10px" }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: `${((answeredQuestions.length) / assessments.questions.length) * 100}%` }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                </div>
              </div>
            </div>  
          </div> 
          }
          {!isAssessment && !isStart &&
         <div className="w-50 w-sm-100"> 
            <div className="d-flex w-100 align-items-center justify-content-center justify-content-md-center justify-content-sm-center justify-content-lg-end">
              <span>Assessment Setup &nbsp;</span>
              {/* <KTIcon iconName='note-2' iconType='outline' className='fs-2 me-1 text-dark' /> */}
              <div>{currentStep-1}/4</div>
              <div className="progress w-50 ms-3" style={{ backgroundColor: "#e9e9e9",height: "10px" }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: `${((currentStep-1) / 4) * 100}%` }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                </div>
              </div>
            </div>  
          </div>
          }
        </div>
        {/* assessment header */}

      </HeaderWrapper>

      <div className="container my-10">
            
        {/* assessment setup content */}
        {!isAssessment && renderStepContent()}
        {/* assessment setup content */}

        {/* actual assessment content */}
        {isAssessment && !isStart && !isAssessmentFinish && 
        <div> 
          <div className="app-container w-50 mt-10 mb-10 mx-auto py-7 shadow-sm border border-gray-300 border-1 rounded">

              {/* Introduction */}
              <div className="mb-4">
                <p className="fs-5">
                This is the next test:
                </p>
                <span className="fs-1 fw-bolder">{assessments?.name}</span>
                <p className="fs-5">
                The actual test starts now. Good luck!
                </p>
                <div className="separator border-2 mb-5 mt-2 border-danger"></div>
                <span className="fs-5">
                The test will start in: <b className="fw-bolder">{startTime}</b>
                </span>
                <p className="fs-5 mt-5">
                  Please stay on this screen. The timer for your next test has started and cannot be paused. The timer continues even when you close the browser.
                </p>
              </div>


                {/* Date */}
                
                  {/* Continue Button */}
                  
          </div>
        </div>}

        {isAssessment && isStart && !isAssessmentFinish && <div>
          <form onSubmit={formik.handleSubmit}>
           <div className="container shadow-sm my-10 rounded bg-white">
        
              <div className="app-content">
                <div className="app-container">
                  <div className="container d-flex flex-column flex-sm-row">
                    <div className="ck-editor-wrapper me-sm-5 col-12 col-sm-6">
                      <h3 className="mb-3 fs-5 fs-sm-4">Question</h3> {/* Adjust heading size */}
                      {
                        
                      }
                      <CKEditor 
                        disabled
                        editor={ClassicEditor} 
                        config={CKEditorConfig} 
                        data={assessments?.questions[currentQuestionIndex].body} 
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-4 mt-sm-0">
                      <h3 className="mb-3 fs-5 fs-sm-4">Select only one answer</h3> {/* Adjust heading size */}
                      {assessments?.questions[currentQuestionIndex].type === 1 && assessments?.questions[currentQuestionIndex]?.choices.map(
                        (choice, idx) => (
                          <label
                            key={choice.id}
                            className={`form-check-image p-3 p-sm-4 mb-4 border border-2 rounded d-flex align-items-center `}
                          >
                            <div className="form-check form-check-danger form-check-custom form-check-solid form-check-sm w-100">

                            <input
                              type="radio"
                              name={`question-${currentQuestionIndex}`}
                              value={choice.choiceBody}
                              className="form-check-input ms-1"
                              checked={formik.values.answer === choice.choiceBody}
                              onChange={() => formik.setFieldValue("answer", choice.choiceBody)}
                            />
                              <label className="form-check-label text-gray-800 fs-6 ms-2">
                                {choice.choiceBody}
                              </label>
                            </div>
                          </label>
                        )
                      )
                      }
                      {assessments?.questions[currentQuestionIndex].type === 2 && 
                      <div className='fv-row'>
                      <label className='form-label required'>Answer</label>
                      <input
                        name='answer'
                        className='form-control form-control-lg form-control-solid'
                        {...formik.getFieldProps('answer')}
                      />
                      </div>}

                      {assessments?.questions[currentQuestionIndex].type === 3 && 
                      <div className='fv-row'>
                        <CameraRecorder
                          onVideoBlob={handleVideoBlob}
                          maxDuration={assessments?.questions[currentQuestionIndex].videoDurations[0].videoDurationMinute * 60}
                        />
                      </div>}
                      {formik.touched.answer && formik.errors.answer && (
                        <div className='text-danger mt-2'>{formik.errors.answer}</div>
                         )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container d-flex justify-content-between">
              <span></span>
              <span>
              <button
                type="submit"
                className="btn btn-danger rounded-pill align-items-center"
                // onClick={handleSubmitAnswer}
              >
                <span className="indicator-label">
                  Next <KTIcon iconName="right" iconType="outline" className="text-white" />
                </span>
              </button>
              </span>
            </div>
          </form>
        </div>}
        {/* actual assessment content */}

        {isAssessmentFinish && 
          <div> 
          <div className="app-container w-50 mt-10 mb-10 mx-auto py-7 shadow-sm border border-gray-300 border-1 rounded">
              {/* Introduction */}
              <div className="mb-4 text-center">
              <h1>Thank you for completing the assessment!</h1>
              </div> 
          </div>
        </div>}  
      </div>
    </div>
    </>
  );
};

const DashboardWrapper = () => {
  return (
    <>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };

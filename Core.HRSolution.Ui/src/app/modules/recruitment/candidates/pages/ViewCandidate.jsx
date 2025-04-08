import { Content } from '../../../../../_metronic/layout/components/content'
import { toAbsoluteUrl } from '@/_metronic/utils';
import { KTIcon} from '@/_metronic/helpers';
import React, { useState, useEffect } from 'react';
import {useAuth} from '../../../../../app/modules/auth'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { 
  infoCandidate, 
  getAllCalendarEvents,
  retrieveEmailsByDistro,
  createComment, 
  SelectJobProfiles, 
  infoWriteUp, 
  removeCandidate, 
  disqualifyCandidate,
  createCandidateCredential
} from '../core/requests/_request';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { TimelinesWrapper } from '@/_metronic/partials/timelines/default/item';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
// import { Form, Button, Alert,ButtonToolbar, ButtonGroup, Dropdown, Offcanvas  } from 'react-bootstrap';
import { PDFViewer } from '../../../../helpers/react_pdf';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../helpers/loading_request';
import { MoveToStageWrapper } from '../components/drawers/MoveToStageDrawer';
import { MoveToJobWrapper } from '../components/drawers/MoveToJobDrawer';
import { CopyToJobWrapper } from '../components/drawers/CopyToJobDrawer';
// import { useThemeMode } from '../../../../../_metronic/partials';
import { useSettings } from '@/_metronic/providers';
import { WriteUpModal } from '../components/modals/WriteUpModal';
import { AnswerCheckingModal } from '../components/modals/AnswerCheckingModal';

import Flatpickr from 'react-flatpickr';
import ActionComponent from '../../../../helpers/action_component';
import { SendEmailModal } from '../components/modals/SendEmailModal';
import { CalendarEvent } from '../components/drawers/CalendarEventDrawer';
import { CalendarEventModal } from '../components/modals/CalendarEventModal';
import { JobOfferModal } from '../components/modals/JobOfferModal';

const ViewCandidatePage = () => {

    const {currentUser} = useAuth()
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [candidateData, setCandidateData] = useState([]);
    const [timelineItems, setTimelineItems] = useState([]);
    const [commentItems, setCommentItems] = useState([]);
    const [isSubmitting, setSubmitting] = useState(false);
    const [applicationProcesses, setApplicationProcesses] = useState([]);
    const [jobProfiles, setJobProfiles] = useState([]);
    const [writeUps, setWriteUps] = useState([]);
    const [hasWriteUp, setHasWriteUp] = useState(false);
    const [assessments, setAssessments] = useState([]);
    const [assessmentId, setAssessmentId] = useState(0);
    const [eventItems, setEvents] = useState([]);
    const [messageItems, setMessages] = useState([]);
    
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const candidateId = params.get('id');

    const [comment, setComment] = useState('');
    const [error, setError] = useState(false);
    // const { mode } = useThemeMode();
    const {
      getThemeMode
    } = useSettings();
    const cardBg = getThemeMode === 'light' ? 'abstract-4-dark.svg' :'abstract-4.svg'

    const [showComposeModal, setShowComposeModal] = useState(false);

    const [showAnswerCheckingModal, setShowAnswerCheckingModal] = useState(false);
    const [ShowJobOfferModal, setShowJobOfferModal] = useState(false);
    
    const [showSendEmailModal, setShowSendEmailModal] = useState(false);
    const [showCalendarEventModal, setShowCalendarEventModal] = useState(false);
    const [dateTime, setDateTime] = useState("");

    const handleChange = (event) => {
      setDateTime(event.target.value);
    };

  const handleDeleteCandidate = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Candidate?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeCandidate(id);
  
          if (res?.data?.success) {
            Swal.fire('Deleted!', 'The Candidate has been deleted.', 'success');
            fetchCandidateInfo();
          } else {
            Swal.fire(
              'Deletion Failed!',
              res?.data?.responseText || 'An unexpected error occurred.',
              'warning'
            );
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.title || 'Failed to delete the candidate.';
          console.error(errorMessage);
          Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  const handleDisqualifyCandidate = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to disqualify this Candidate?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, disqualify it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await disqualifyCandidate(id);
  
          if (res?.data?.success) {
            Swal.fire('Disqualified!', 'The Candidate has been disqualified.', 'success');
            fetchCandidateInfo();
          } else {
            Swal.fire(
              'Disqualify Failed!',
              res?.data?.responseText || 'An unexpected error occurred.',
              'warning'
            );
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.title || 'Failed to disqualify the candidate.';
          console.error(errorMessage);
          Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

    const handleShowWriteUpModal = async () => {
      setShowComposeModal(true);
    } 
    const handleCloseComposeModal = () => {
      setShowComposeModal(false)
    };
    const handleSendEmailModal = async () => {
      setShowSendEmailModal(true);
    } 
    const handleCloseSendEmailModal = () => {
      setShowSendEmailModal(false)
      fetchCandidateInfo()
    };
    const handleCalendarEventModal = async () => {
      setShowCalendarEventModal(true);
    } 
    const handleCloseCalendarEventModal = () => {
      setShowCalendarEventModal(false)
    };
    const handleCloseRefresh = () => {
      setShowCalendarEventModal(false)
      fetchCandidateInfo()
    };
    const handleCloseCheckingModal = () => {
      setShowAnswerCheckingModal(false)
      fetchCandidateInfo()
    };
    const handleShowAnswerCheckingModal = async () => {
      setShowAnswerCheckingModal(true);
    } 
    const handleCloseJobOfferModal = async () => {
      setShowJobOfferModal(false);
    } 
    const handleOpenJobOfferModal = async () => {
      setShowJobOfferModal(true);
    } 

    const OpenCheckingModal = (assessmentId) => {
      setAssessmentId(assessmentId)
      handleShowAnswerCheckingModal()
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      
      // Get the formatted date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    };
    const handleSendInvite  = async () => {
      const formattedDate = formatDate(dateTime);
      Swal.fire({
        title: 'Assessment Invitation',
        text: 'Do you want to send assessment invitation this Candidate?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, send it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {

            const formData = new FormData();
            formData.append('CandidateId', candidateData.id);
            formData.append('Expiration', formattedDate);

            const res = await createCandidateCredential(formData);
    
            if (res?.data?.success) {
              Swal.fire('Assessment Invitation Sent!', 'The Candidate has been invited.', 'success');
              fetchCandidateInfo();
            } else {
              Swal.fire(
                'Invitation Failed!',
                res?.data?.responseText || 'An unexpected error occurred.',
                'warning'
              );
            }
          } catch (error) {
            const errorMessage =
              error?.response?.data?.title || 'Failed to send invitation to the candidate.';
            console.error(errorMessage);
            Swal.fire('Error!', errorMessage, 'error');
          }
        }
      });
    };
    const handleCloseComposeModalWithReload = () => {
      setShowComposeModal(false)
      fetchWriteUp();
    };

    const handleCloseDrawerWithRefresh = () => {
      fetchCandidateInfo();
      handleCloseMoveToStageDrawer();
    };

    
    const handleCloseCopyToJobDrawerWithRefresh = () => {
      fetchCandidateInfo();
      handleCloseCopyToJobDrawer();
    };

    const [showCopyToJobDrawer, setshowCopyToJobDrawer] = useState(false);
    const handleCloseCopyToJobDrawer = () => setshowCopyToJobDrawer(false);
    const handleShowCopyToJobDrawer = () => setshowCopyToJobDrawer(true);

    const fetchCandidateInfo = async () => {
      enableLoadingRequest();
      setLoading(true)
      try {
        const response = await infoCandidate(candidateId );
        if (response.data) {
          const event = await getAllCalendarEvents(response.data.candidate.email) 
            setEvents(event.data)
            const messages = await retrieveEmailsByDistro(response.data.candidate.email)
            setMessages(messages.data)
            setCandidateData(response.data.candidate);
            setTimelineItems(response.data.candidateHistory)
            setCommentItems(response.data.candidateComment)
            setAssessments(response.data.candidateAssessment)
            setApplicationProcesses(response.data.currentProcess.jobApplicationProcesses)
        }
      } catch (error) {
        console.log(error)
      } finally {
        disableLoadingRequest();
        setLoading(false);
      }   
    };

    const fetchJobProfiles = async () => {
      try {
        const response = await SelectJobProfiles();
        if (response) {
            setJobProfiles(response.data.jobProfiles)
        }
      } catch (error) {
        console.log(error)
      } finally {

        // setLoading(false);
      }   
    };

    const fetchWriteUp = async () => {
      try {
        const response = await infoWriteUp(candidateId);
        if (response) {
            setWriteUps(response.data.writeUp[0])
            setHasWriteUp(response.data.hasWriteUp)
        }
      } catch (error) {
        console.log(error)
      } finally {

        // setLoading(false);
      }   
    };

    const handleCopy = (data) => {
      if (data) {
        navigator.clipboard.writeText(data)
          .then(() => alert("Copied to clipboard!")) // Optional feedback
          .catch(err => console.error("Failed to copy:", err));
      }
    }; 

    const handleAddComment = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      if (!comment.trim()) {
          setError(true); // Set error if the comment is empty
          return;
      }

      setError(false); // Clear any previous errors
        

      try {
        setSubmitting(true);
        const formData = new FormData();
        formData.append(`Comment`, comment);
        formData.append(`CandidateId`, candidateData.id);
        formData.append(`CreatedBy`, currentUser.loggedUser.emoloyeeId);
        const response = await createComment(formData);
        Swal.fire({
          title: 'Success!',
          text: `${response.data.responseText}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // if (onSubmitSuccess) {
            // onSubmitSuccess(); // Trigger the refresh function
            fetchCandidateInfo();
          // }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message || 'An error occurred while creating the profile.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setSubmitting(false);
        // setLoading(false);
      }              
      // Perform any API call or state update here

      setComment(''); // Clear the form field after submission
  };

  const [showMoveToStageDrawer, setshowMoveToStageDrawer] = useState(false);

  const handleCloseMoveToStageDrawer = () => setshowMoveToStageDrawer(false);
  const handleShowMoveToStageDrawer = () => setshowMoveToStageDrawer(true);

    useEffect(() => {
      fetchCandidateInfo();
      fetchJobProfiles();
      fetchWriteUp();
    }, [candidateId]);

  return(
  <>
    {!loading && 
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <a href='candidates' className='btn btn-sm btn-light-danger'>
              <KTIcon iconName='entrance-right' className='fs-2' />
                Go Back
              </a>
          </div>
        </div>
      </div>}
      {!loading && 
      <div
        className="hero-bg text-start p-9 py-5 "
        style={{
          backgroundImage: `url('${toAbsoluteUrl(`/media/svg/shapes/${cardBg}`)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="container-fluid">
          <div className="d-flex justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2">
                  <h1 className="card-title mb-0 fw-bold">{candidateData.firstName + " " + candidateData.lastName}</h1>
              </div>
              <div className="d-flex align-items-between gap-3 py-4">
                <div className=" gap-3 text-sm">
                  <div className="d-flex align-items-center gap-2" >
                    <i className="fa-solid fa-phone"></i>
                      <span className=" fw-medium">{candidateData.phoneNumber}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2" >
                    <i className="fa-solid fa-envelope"></i>
                      <span className=" fw-medium">{candidateData.email}</span>
                  </div>
                </div>
              </div>
              </div>
              <div className="text-end align-items-end justify-content-center">
                {/* <ButtonToolbar aria-label="Toolbar with button groups" className='text-end'>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                  <ActionComponent
                    buttonPermission={'recruitment.remove.candidate'}
                    actionButton={ 
                      <Button 
                        variant={candidateData.isActive ? 'light' : 'danger'}
                        className="btn-icon btn-icon-lg size-9 " 
                        onClick={() => handleDeleteCandidate(candidateData.id)}
                      >
                        <KTIcon iconName='trash' className='fs-3 '/>
                      </Button>
                  }/>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                  <ActionComponent
                    buttonPermission={'recruitment.disqualify.candidate'}
                    actionButton={ 
                  <Button 
                    variant={candidateData.isDisqualified ? 'danger' : 'light'} 
                    className={ candidateData.isDisqualified ? "btn-icon btn-icon-lg size-9 disabled" : "btn-icon btn-icon-lg size-9" }
                    onClick={() => handleDisqualifyCandidate(candidateData.id)}
                  >
                    <KTIcon iconName='dislike' className='fs-3 '/>
                  </Button>
                    }/>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                  <ActionComponent
                    buttonPermission={'recruitment.copy.candidate.job'}
                    actionButton={ 
                    <Button variant='light' type="button" onClick={handleShowCopyToJobDrawer} className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='copy' className='fs-3'/>
                    </Button>
                    }/>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1 pe-0" aria-label="First group">
                  <ActionComponent
                    buttonPermission={'recruitment.update.candidate.job'}
                    actionButton={ 
                    <Button variant='light' type="button" id="kt_drawer_move_to_job_button" className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='arrow-up-right' className='fs-3' />
                    </Button>
                    }/>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1 pe-0" aria-label="First group">
                  <ActionComponent
                    buttonPermission={'candidate.move.to.job'}
                    actionButton={ 
                    <Button variant='light' type="button" onClick={handleSendEmailModal} className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='sms' className='fs-3' />
                    </Button>
                    }/>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1 pe-0" aria-label="First group">
                  <ActionComponent
                    buttonPermission={'recruitment.create.calendar.event'}
                    actionButton={ 
                    <Button variant='light' type="button"  onClick={handleCalendarEventModal} className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='calendar' className='fs-3' />
                    </Button>
                    }/>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                    <Dropdown>
                    <ActionComponent
                    buttonPermission={'recruitment.update.candidate.write.up'}
                    actionButton={ 
                      <Dropdown.Toggle variant="light" type="button" className='' id="dropdown-basic" >
                        <KTIcon iconName='user-edit'  className='fs-3'/>
                      </Dropdown.Toggle>
                    }/>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={handleShowWriteUpModal}>Create or Update Write Up</Dropdown.Item>
                        <Dropdown.Item href={`documentwriteup?id=${candidateId}`}>Write Up Document</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className=" py-1 pe-0" aria-label="First group">
                    <ActionComponent
                    buttonPermission={'recruitment.update.candidate.stage'}
                    actionButton={ 
                    <Button variant='light' type="button" onClick={handleShowMoveToStageDrawer}>
                      Move Candidate <KTIcon iconName='double-right' className='fs-3'/>
                    </Button>
                     }/> 
                  </ButtonGroup>
                </ButtonToolbar> */}
              </div>
            
          </div>
            
        </div>
      </div>
      }
    {!loading && 
    <Content>

      {/* <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas> */}
      <div className='mb-5 mb-xl-8 px-2 py-0 '>
        <div className="row fs-5 mb-5">
            
              <div className="col-8">
                <div className="card p-8">
                    
                      <div className='d-flex overflow-auto h-55px '>
                          <ul className="nav nav-pills ">
                              <li className="nav-item">
                                  <a className="nav-link active btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_profile">
                                      Profile
                                  </a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_communication">
                                      Communication
                                  </a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_review">
                                      Review
                                  </a>
                              </li>
                              <li className="nav-item">
                                  <a className="nav-link btn btn-light-dark btn-sm" data-bs-toggle="tab" href="#tab_candidate_comments">
                                      Comments
                                  </a>
                              </li>
                          </ul>
                      </div>  
                      <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="tab_candidate_profile" role="tabpanel">
                          <div className='d-flex justify-content-start my-7'>
                            <div>Position: <b>{candidateData.jobName}</b></div>
                          </div>
                          <div className='d-flex justify-content-start my-7'>
                          <div>Application Status: <b>{candidateData.stageName}</b></div>
                          </div>
                          <div className='row justify-content-start my-7'>
                            <div className='col'>Current Employment Status: <b>{candidateData.currentEmploymentStatus}</b></div>
                            <div className='col'>Notice Period: <b>{candidateData.noticePeriod}</b></div>
                          </div>
                          <div className='row justify-content-start my-7'>
                            <div className='col'>Expected Salary: <b>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidateData.currentSalary)}</b></div>
                            <div className='col'> Expected Salary: <b>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(candidateData.expectedSalary)}</b></div>
                          </div>
                          <div className='d-flex justify-content-start my-2'>
                            <div>Resume:</div>
                          </div>
                          <div className='border p-2'>
                        <PDFViewer candidateId={candidateId}/>
                        </div>
                        </div>
                        <div className="tab-pane fade" id="tab_candidate_timeline" role="tabpanel">
                          <h2>2</h2>
                        </div>
                        <div className="tab-pane fade" id="tab_candidate_communication" role="tabpanel">
                          <div className='d-flex overflow-auto h-55px '>
                            <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
                                <li className="nav-item">
                                    <a className="nav-link active" data-bs-toggle="tab" href="#tab_messages">
                                        Messages
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-bs-toggle="tab" href="#tab_events">
                                        Events
                                    </a>
                                </li>
                            </ul>
                          </div> 
                          <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="tab_messages" role="tabpanel">
                            {messageItems.map((data, index) => (
                              <div key={index}>
                                <div className="flex flex-col">
                                  <div className="text-sm text-gray-800">
                                                        <b>{data.fromName}</b> <span className='fs-6 text-gray-800'>{data.subject.startsWith("Re:") ? "replied from " + data.from : "sent an email"}</span>
                                                      </div>
                                                      <span className="fs-7 text-gray-600">
                                                        {dayjs(data.receivedDateTime).fromNow()}
                                                      </span>
                                </div>   
                                <div className="row mt-3">

                                  <span className="text-xs text-gray-800 col-12"
                                  dangerouslySetInnerHTML={{ __html: data.bodyPreview.replace(/\r\n|\n/g, "<br />") }}>
                                  </span>                        
                                </div>                                                      
                                {/* <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-800 col-6">
                                  Date:
                                  </div>
                                  <span className="text-xs text-gray-600 col-6">
                                    {dayjs(data.end).format('dddd DD/MM/YYYY')}
                                  </span>                        
                                </div>   
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-800 col-6">
                                    Time:
                                  </div>
                                  <span className="text-xs text-gray-600 col-6">
                                  {dayjs(data.start).format('hh:mm A')} - {dayjs(data.end).format('hh:mm A')}
                                  </span>                        
                                </div>  
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-800 col-6">
                                    Attendees:
                                  </div>
                                  <span className="text-xs text-gray-600 col-6">
                                  {data.attendees.map((item) => (
                                    <div>{item}</div>
                                  ))}
                                  </span>                        
                                </div>     
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-800 col-6">
                                    Meeting Link:
                                  </div>
                                  <span className="text-xs text-gray-600 col-6">
                                    <a href={data.meetingLink}>{data.location}</a>
                                    <a onClick={() => handleCopy(data.meetingLink)} style={{ cursor: "pointer" }}><KTIcon iconName='fasten' className='fs-2' /></a>

                                  </span>                        
                                </div>     */}
                                <div className="separator border-dark border-secondary my-5"></div>           
                              </div>

                            ))}
                            </div>
                            <div className="tab-pane fade" id="tab_events" role="tabpanel">
                            {eventItems.map((data, index) => (
                              <div key={index}>
                                <div className="flex flex-col">
                                  <div className="text-sm text-gray-800">
                                                        <b>{data.organizerName}</b> scheduled an Interview {data.location}
                                                      </div>
                                                      <span className="fs-6 text-gray-600">
                                                        {dayjs(data.createdDateTime).fromNow()}
                                                      </span>
                                                    </div>   
                                <div className="row col-8 mt-3">
                                  <div className="text-sm text-gray-600 col-6">
                                  Event title:
                                  </div>
                                  <span className="text-xs text-gray-800 col-6">
                                    {data.subject}
                                  </span>                        
                                </div>                                                      
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-600 col-6">
                                  Date:
                                  </div>
                                  <span className="text-xs text-gray-800 col-6">
                                    {dayjs(data.end).format('dddd DD/MM/YYYY')}
                                  </span>                        
                                </div>   
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-600 col-6">
                                    Time:
                                  </div>
                                  <span className="text-xs text-gray-800 col-6">
                                  {dayjs(data.start).format('hh:mm A')} - {dayjs(data.end).format('hh:mm A')}
                                  </span>                        
                                </div>  
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-600 col-6">
                                    Attendees:
                                  </div>
                                  <span className="text-xs text-gray-800 col-6">
                                  {data.attendees.map((item, index) => (
                                    <div key={index}>{item}</div>
                                  ))}
                                  </span>                        
                                </div>     
                                <div className="row col-8 mt-2">
                                  <div className="text-sm text-gray-600 col-6">
                                    Meeting Link:
                                  </div>
                                  <span className="text-xs text-gray-800 col-6">
                                    <a href={data.meetingLink}>{data.location}</a>
                                    <a onClick={() => handleCopy(data.meetingLink)} style={{ cursor: "pointer" }}><KTIcon iconName='fasten' className='fs-2' /></a>

                                  </span>                        
                                </div>    
                                <div className="separator border-secondary my-5"></div>           
                              </div>

                            ))}
                            </div>
                          </div>
                        </div>
                        {candidateData.candidateCredentials != null && candidateData.candidateCredentials.isAssessmentFinished && <div className="tab-pane fade" id="tab_candidate_review" role="tabpanel">
                         {assessments.map((data, index) => (
                            <div className="card d-flex justify-content-between border p-5 mb-2" key={index}>
                              <div className='card-body d-flex flex-column p-0'>
                                <div className='d-flex flex-stack mb-2'>
                                <div className='fw-bolder'>
                                  {data.assessmentName}
                                </div>
                                {data.needToCheck > 0 && (
                                <ActionComponent
                                buttonPermission={'recruitment.submit.candidate.correction'}
                                actionButton={ 
                                    <a
                                      href="#"
                                      className='btn btn-icon btn-light-danger btn-active-light-danger btn-sm mx-1 position-relative'
                                      onClick={() => OpenCheckingModal(data.assessmentDetails[0].assessmentId)}>
                                      <i className="bi bi-three-dots fs-3"></i><span className="position-absolute top-0 start-100 translate-middle  badge badge-circle badge-danger">{data.needToCheck}</span>
                                    </a>                                                        

                                }/>
                                )}
                                
                                </div>
                                <div className='d-flex flex-stack'>
                                <span className=" fs-5">
                                  Correct Answers {data.correctCount}/{data.totalQuestions}
                                </span>

                                <h3 className='p-3 border border-danger rounded bg-light-danger'>{(data.correctCount / data.totalQuestions * 100).toFixed(0)}</h3>
                                
                                </div>
                              </div>
                              <div className="text-end">
                              
                               
                                
                              </div>
                              {/* <div className="separator border-secondary my-5"></div> */}
                            </div>
                        ))}
                      
                        </div>
                        }

                        {candidateData.candidateCredentials != null && candidateData.candidateCredentials.isAssessmentStarted && <div className="tab-pane fade" id="tab_candidate_review" role="tabpanel">
                            <div className="d-flex justify-content-center border p-5">
                              <div>
                                <span className="text-sm fs-1">
                                  {/* Correct Answers {data.correctCount}/{data.totalQuestions} */}
                                  Assessment Ongoing...
                                </span>
                              </div>
                            </div>
                        </div>
                        }

                        {candidateData.candidateCredentials != null && !candidateData.candidateCredentials.isAssessmentStarted  && <div className="tab-pane fade" id="tab_candidate_review" role="tabpanel">
                            <div className="d-flex justify-content-center border p-5">
                              <div>
                                <span className="text-sm fs-1">
                                  {/* Correct Answers {data.correctCount}/{data.totalQuestions} */}
                                  Assessment Invite Sent
                                </span>
                              </div>
                            </div>
                        </div>
                        }

                        {candidateData.candidateCredentials == null && candidateData.applicationStatusId == 5 && <div className="tab-pane fade" id="tab_candidate_review" role="tabpanel">
                          <div className='btn text-center d-flex mx-10'>

                            <input type="datetime-local" className="form-control"
                            value={dateTime}
                             onChange={handleChange}></input> 
                            <ActionComponent
                    buttonPermission={'recruitment.create.candidate.credential'}
                    actionButton={
                            <div className='form-control form-control-solid ms-2 btn bg-light-danger' 
                            onClick={() => handleSendInvite()}>Send Assessment Invite
                            </div>
                    }/>
                          </div>
                        </div>
                        }
                        <div className="tab-pane fade" id="tab_candidate_comments" role="tabpanel">

                        {commentItems.map((data, index) => (
                            <div className="flex flex-col" key={index}>
                              <div className="text-sm text-gray-800">
                                {data.createdByName} added a comment
                              </div>
                              <span className="text-xs fs-7 text-gray-600">
                                {dayjs(data.createdDate).fromNow()}
                              </span>
                              <div className="text-sm text-gray-800">
                                {data.comment}
                              </div>
                              <div className="separator border-secondary my-5"></div>
                            </div>
                        ))}

                          {/* <Form id="commentForm" onSubmit={handleAddComment}>
                              <Form.Group controlId="exampleFormControlTextarea1">
                                  <Form.Label>Enter your comment</Form.Label>
                                  <Form.Control 
                                      as="textarea" 
                                      rows={3} 
                                      placeholder="Please enter your comment" 
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      isInvalid={error} // Adds Bootstrap's invalid state styling
                                  />
                                  <Form.Control.Feedback type="invalid">
                                      Comment cannot be empty.
                                  </Form.Control.Feedback>
                              </Form.Group>
                              <Button 
                                  type="submit" 
                                  variant="danger" 
                                  className="mt-3"
                                  disabled={isSubmitting} // Properly disables the button
                              >
                                  Add Comment
                              </Button>
                          </Form> */}

                      </div>
                      </div>
                </div>
              </div>
              <div className='col-4 '>
                <div className="card card-flush hover-scroll p-5 mb-0"
                // <div className="card card-flush hover-scroll p-5 mb-0 h-550px"
                    // data-kt-sticky="true"
                    // // data-kt-sticky-name="docs-sticky-summary"
                    // // data-kt-sticky-offset="{default: 5px, xl: '5px'}"
                    // data-kt-sticky-width="{sm: '200px',md: '180px', lg: '220px', xl: '370px'}"
                    // // data-kt-sticky-left="auto"
                    // data-kt-sticky-top="100px"
                    // data-kt-sticky-animation="false"
                    // data-kt-sticky-zindex="95"
                >
                  {/* <div className="card-header"> */}
                    <h3 className="card-title">Timeline</h3>
                  {/* </div> */}

                  {timelineItems.map((data, index) => (
                    <TimelinesWrapper key={index} icon="slack" color={data.type} line={true}>
                      <div className="flex flex-col row">
                        <div className="text-sm text-gray-800 row">
                          {data.description} <span className='text-gray-600 text-sm col-5 text-truncate'>{data.createdByName}</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {dayjs(data.createdDate).fromNow()}
                        </span>
                      </div>
                    </TimelinesWrapper>
                  ))}
                  {/* <MyApp /> */}
                </div>
                
              </div>
        </div>
      </div>
      <CopyToJobWrapper candidateData={candidateData} applicationProcessesData={applicationProcesses} jobData={jobProfiles} handleShow={showCopyToJobDrawer} handleClose={handleCloseCopyToJobDrawer} handleCloseWithRefresh={handleCloseCopyToJobDrawerWithRefresh}/>
      <MoveToJobWrapper applicationProcessesData={applicationProcesses} jobData={jobProfiles} currentJob={candidateData.jobId} candidateId={candidateId} currentStage={candidateData.applicationStatusId} handleClose={handleCloseCopyToJobDrawer}/>
      <MoveToStageWrapper applicationProcessesData={applicationProcesses} currentStage={candidateData.applicationStatusId} candidateId={candidateId} handleShow={showMoveToStageDrawer} handleClose={handleCloseMoveToStageDrawer} handleCloseWithRefresh={handleCloseDrawerWithRefresh} handleOpenJobOfferModal={handleOpenJobOfferModal}/>
      <WriteUpModal show={showComposeModal} handleClose={handleCloseComposeModal} WriteUp={writeUps} candidateId={candidateId} hasWriteUp={hasWriteUp} handleCloseWithReload={handleCloseComposeModalWithReload}/>
      <AnswerCheckingModal show={showAnswerCheckingModal} handleClose={handleCloseCheckingModal} candidateId={candidateId} assessmentId={assessmentId}/>
      <JobOfferModal show={ShowJobOfferModal} handleClose={handleCloseJobOfferModal} candidate={candidateData} candidateId={candidateId}/>
      <SendEmailModal show={showSendEmailModal} handleClose={handleCloseSendEmailModal} candidateEmail={candidateData.email}/>
      <CalendarEventModal show={showCalendarEventModal} handleCloseRefresh={handleCloseRefresh} handleClose={handleCloseCalendarEventModal} candidateEmail={candidateData.email} fromUserEmail={currentUser.loggedUser.emailAddress}/>
    </Content>
     } 
  </>
  )
  
}

const ViewCandidate = () => {
  return (
    <>
      <ViewCandidatePage />
    </>
  )
}

export { ViewCandidate }

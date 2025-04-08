import { useAuth } from '../../../../app/modules/auth'
import { useState } from 'react';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { KTIcon} from '@/_metronic/helpers';

const Step2Div = ({handleNext}) => {
  const { currentUser } = useAuth()
   const [timelineData, setAssessments] = useState(currentUser.loggedCandidate.assessments);

  return (
    <div className="app-container py-7 shadow-sm border border-gray-300 border-1 rounded mb-10">
                {/* Introduction */}
        <div className="mb-4">
            <h2>Hello {currentUser.loggedCandidate.firstName}! Ready to showcase your skills?</h2>
                  <p className="fs-5">
                    Thank you for applying for this role and welcome to your skill assessment administered by
                    Core.
                  </p>
                  <p className="fs-5">
                    Completing it will give you a chance to show off your skills and stand out from the
                    crowd! Good luck!
                  </p>
                  <p className="fs-5"><strong>This assessment includes the following steps:</strong></p>
                </div>

                <div className="timeline">
                  {timelineData.map((item, index) => (
                    <div key={index} className="timeline-item align-items-center mb-7">
                      {/* Timeline line (render only if not the last item) */}
                      {index !== timelineData.length - 1 && (
                        <div className="timeline-line mt-2 mb-n5 mb-sm-n6 border-2 border-dark"></div>
                      )}

                      {/* Timeline icon */}
                      <div className="timeline-icon border-2 border-danger">
                        <div
                          className="rounded-circle  bg-light-danger d-flex align-items-center justify-content-center"
                          style={{ width: "25px", height: "25px" }}
                        >
                          <span className="fs-5 fw-bolder">{index + 1}</span>
                        </div>
                      </div>

                      {/* Timeline content */}
                      <div className="timeline-content m-0">
                        <span className="fs-6 fw-bold text-gray-800">{item.name}</span>
                        <span className="fs-6 text-gray-500 fw-semibold d-block">
                          {item.assessmentQuestions.length} questions | {item.duration} minutes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              {/* Footer Section */}
              <div className="row">
                <div className="col-md-6">
                  <div className="border rounded bg-light-danger border-danger p-3">
                    <h5>Learn how to navigate your assessment:</h5>
                    <ul>
                      <li className="fs-5">
                        We recommend completing the assessment in one go, but you can pause or take breaks
                        between tests if needed.
                      </li>
                      <li className="fs-5">The assessment is timed. A timer is shown per test and/or per question.</li>
                      <li className="fs-5">
                        You can use pen, paper, and calculator during the assessment but avoid using AI and
                        other tools.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded bg-light-danger border-danger p-3">
                    <h5>Technical requirements for your assessment:</h5>
                    <ul>
                      <li className="fs-5">
                        Have a camera and microphone as you may be required to answer questions in a video
                        format.
                      </li>
                      <li className="fs-5">
                        Enable webcam and speakers/headphones for identity verification and test integrity.
                      </li>
                      <li className="fs-5">
                        Ensure you have a reliable internet connection to avoid any disruptions during your
                        assessment.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            {/* Continue Button */}
            <div className="text-end mt-10">
                        <button
                    className="btn btn-danger rounded-pill "
                    onClick={handleNext}
                    //   disabled={currentStep === 4}
                    >
                    Continue
                    </button>
              </div>  
          </div>
          
  );
};

export { Step2Div };

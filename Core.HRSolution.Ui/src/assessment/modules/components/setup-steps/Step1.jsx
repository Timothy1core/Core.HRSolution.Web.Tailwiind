import * as Yup from 'yup';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { useFormik } from 'formik';
import { useAuth } from '../../../../app/modules/auth'
const step1Schema = Yup.object().shape({
  terms: Yup.string().required('Required'),
});

const Step1Div = ({handleNext}) => {
  const { currentUser } = useAuth()

  const formik = useFormik({
    initialValues: { terms: false },
    validationSchema: step1Schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      // setLoading(true);
      try {
        handleNext()
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        // setLoading(false);
      }
    },
  });

  return (
    <div className="d-flex flex-column flex-sm-row">
      <div className="app-container me-sm-10 flex-grow-1 col-12 col-sm-6 py-7 shadow-sm border border-gray-300 border-1 rounded">
        <h1>Time to showcase your skills!</h1>

        <span className="fs-5">
          Thank you for your interest in this position at Core. We're excited to invite you to demonstrate
          your skills through an assessment. This is your opportunity to shine and showcase your
          abilities beyond your resume.
        </span>

        <br />
        <br />

        <span className="fs-5">
          Duration: Duration mins maximum
        </span>

        <div className="separator border-2 my-8 border-danger"></div>

        <div className="d-flex justify-content-between mt-5 bg-light-danger p-5 rounded">
          <div className="d-flex align-items-center justify-content-center flex-column mb-3">

            <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
              <span className="fs-4 fw-bolder">1</span>
            </div>

            <span className="fs-5 fw-bold">Setup your Information</span>

            <span className="fs-5 ">Get candidate details</span>
          </div>
          <div className="d-flex align-items-center justify-content-center flex-column mb-3">

            <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
              <span className="fs-4 fw-bolder">2</span>
            </div>

            <span className="fs-5 fw-bold">Set up your device</span>

            <span className="fs-5 ">Test audio and video</span>

          </div>
          <div className="d-flex align-items-center justify-content-center flex-column mb-3">
            <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mb-2" style={{ width: '40px', height: '40px' }}>
              <span className="fs-4 fw-bolder">3</span>
            </div>

            <span className="fs-5 fw-bold">Start the assessment</span>

            <span className="fs-5 ">Show your skills</span>
          </div>

        </div>
      </div>
      
      <div className="app-container py-7 col-12 col-sm-5 shadow-sm border border-gray-300 rounded">
        <div>
          <img
              alt='Logo'
              src={toAbsoluteUrl('core_logos/core-logo-gray-text.png')}
              className='h-30px'
          />
        </div>

        <br />
        <span className="fs-5 fw-bolder mb-10">Hi! {currentUser.loggedCandidate.firstName} {currentUser.loggedCandidate.lastName}, please read the terms and condition before we setup your device and start the assessment.</span>
      
        <form onSubmit={formik.handleSubmit}>
          <div className="form-check form-check-custom form-check-danger form-check-solid my-10 ">
              <input 
                className="form-check-input h-20px w-20px" 
                type="checkbox" 
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.terms} 
                id="flexCheckbox30" 
                name="terms"/>
              <label className="ms-2 fs-5 required" htmlFor="flexCheckbox30">
                  I have read and accepted the privacy policy and candidate terms
              </label>
              
          </div>
          {formik.touched.terms && formik.errors.terms ? (
                  <div className='text-danger mb-2'>{formik.errors.terms}</div>
                ) : null}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-danger rounded-pill w-75 "
              type="submit"
            >
              Let's go
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Step1Div };

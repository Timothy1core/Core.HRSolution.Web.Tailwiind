import { useAuth } from '../../../../app/modules/auth'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const step2Schema = (currentUser) => Yup.object().shape({
  signature: Yup.string()
    .oneOf([currentUser.loggedCandidate.jobName + " TEST"], `Signature must be "${currentUser.loggedCandidate.jobName} TEST".`)
    .required("Required"),
});

const Step3Div = ({handleNext}) => {
  const { currentUser } = useAuth()
  const today = new Date();
  const formattedDate = today.toLocaleDateString();

  

  const formik = useFormik({
    initialValues: { signature: "" },
    validationSchema: step2Schema(currentUser),
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
    <div className="app-container w-50 mb-10 mx-auto p-10 py-7 shadow-sm border border-gray-300 border-1 rounded">

              {/* Introduction */}
              <div className="mb-4 p-10">
                <span className="fs-1 fw-bolder">Honesty Agreement</span>
                <div className="separator border-2 mb-5 mt-2 border-danger"></div>
                <p className="fs-5">
                TestGorilla strives to create a fair test-taking experience for all. We use advanced
                methods to detect dishonesty and to protect the integrity of your assessment. Instances
                of dishonesty may lead to disqualification from the assessment and our platform, and may
                be reported to the employer who requested your assessment.
                </p>
                <p className="fs-5">
                The use of AI tools, taking an assessment multiple times, and other behaviors outlined
                in the full policy are not allowed unless instructed otherwise.{' '}
                <a href="#" className="text-primary">
                  View the full Candidate Honesty Policy
                </a>.
                </p>
                <div className="separator border-1 mb-5 mt-2 border-danger"></div>
                <p className="fs-5">
                  Please agree with this policy by entering <b>{currentUser.loggedCandidate.jobName} TEST</b> as your signature.
                </p>
                <p className="fs-5">
                  I acknowledge that I have read and understood TestGorilla’s Candidate Honesty Policy,
                  and I agree to abide by it. I understand the importance of upholding honesty and
                  integrity in assessments.
                </p>
                <form onSubmit={formik.handleSubmit}>
                  <label htmlFor="signature" className="form-label">
                      Signature
                    </label>
                    <input
                      type="text"
                      id="signature"
                      name="signature"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      placeholder="Enter your signature"
                    />
                    {formik.touched.signature && formik.errors.signature ? (
                    <div className='text-danger mb-2'>{formik.errors.signature}</div>
                  ) : null}
                    <p className="card-text mt-1">Date: {formattedDate}</p>
                    <div className="separator border-1 mb-5 mt-2 border-danger"></div>
                    <div className="text-end">
                    <button
                      className="btn btn-danger rounded-pill "
                      type="submit"
                      >
                      Continue
                      </button>
                    </div>
                </form>
              </div>
              
            

                {/* Date */}
                
                  {/* Continue Button */}
                  
              </div>
          
  );
};

export { Step3Div };

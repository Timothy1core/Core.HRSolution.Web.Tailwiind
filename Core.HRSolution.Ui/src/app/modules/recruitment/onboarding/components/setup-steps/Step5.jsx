import { useFormik } from 'formik';
// import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { acknowledgeOnboardingForm } from '../../core/requests/_request';

const Step5Div = ({ handleBack, id }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      acknowledgment1: false,
      acknowledgment2: false,
    },
    validate: (values) => {
      const errors = {};
      if (!values.acknowledgment1) {
        errors.acknowledgment1 = 'Required';
      }
      if (!values.acknowledgment2) {
        errors.acknowledgment2 = 'Required';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const res = await acknowledgeOnboardingForm(id, values.acknowledgment1);
        if (res.data.success) {
          Swal.fire({
            title: 'Submitted!',
            text: 'Acknowledgement successfully submitted!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              handleBack()
            }
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message || 'An error occurred', 'error');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    // <Container className="my-5">
      <form onSubmit={formik.handleSubmit}>
        <div className="row mt-5 justify-content-center">
          <div className="col-9">
            <h5 className="text-danger">Reminders</h5>
            <p className="mb-4 text-muted fs-7">
              Please check all details that you have provided, thoroughly. This will serve as your official record with One CoreDev IT Inc. The company will not be held liable for any incorrect information that you have submitted.
            </p>
          </div>
        </div>

        <div className="row mt-5 justify-content-center">
          <div className="col-9">
            {[
              {
                name: 'acknowledgment1',
                label:
                  'I hereby certify that the information provided in this form is complete, true and correct to the best of my knowledge.',
              },
              {
                name: 'acknowledgment2',
                label:
                  'I also understand that for any willful dishonesty, all possible consequences and liability will be taken against me.',
              },
            ].map(({ name, label }, index) => (
              <div className="form-check mb-4" key={name}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={name}
                  name={name}
                  checked={formik.values[name]}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label text-dark fs-7 required" htmlFor={name}>
                  {label}
                </label>
                {formik.errors[name] && (
                  <div className="text-danger small mt-1">{formik.errors[name]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between mt-5">
          <button type="button" className="btn btn-light" onClick={handleBack}>
            Back
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    // </Container>
  );
};

export { Step5Div };

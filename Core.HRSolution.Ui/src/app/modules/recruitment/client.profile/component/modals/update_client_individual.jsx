import { useState } from 'react';
import Swal from 'sweetalert2';
// import { Modal, Button } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { UpdateClientIndividual } from '../../core/request/clients_request';

const clientIndividualValidationSchema = Yup.object().shape({
    clientName: Yup.string().max(1000, 'Must be 1000 characters or less').required('Client Name is required'),
    position: Yup.string().max(1000, 'Must be 1000 characters or less').required('Position is required'),
    email: Yup.string().max(1000, 'Must be 1000 characters or less').required('Email is required'),
});

function UpdateClientIndividualModal({clientIndividual,onSuccess }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const formik = useFormik({
    initialValues: {
        clientName: clientIndividual.name,
        position: clientIndividual.position,
        email: clientIndividual.email
    },
    validationSchema: clientIndividualValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const formData = new FormData();

        formData.append(`Name`, values.clientName);
        formData.append(`Position`, values.position);
        formData.append(`Email`, values.email);
       
        const response = await UpdateClientIndividual(clientIndividual.id,formData);
        setShow(false); // Close the modal
        Swal.fire({
          title: 'Success!',
          text: `${response.data.responseText}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          if (onSuccess) {
            onSuccess(); // Trigger the refresh function
          }
        });
      } catch (error) {
        setStatus(error.message || 'An error occurred');
        Swal.fire({
          title: 'Error!',
          text: error.message || 'An error occurred while creating the profile.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <>
        <a href="#" className="fs-4 text-gray-800 text-hover-primary fw-bold mb-0" onClick={() => setShow(true)}>
            {clientIndividual.name}
        </a>
        {/* <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-800px">
            <Modal.Header>
            <Modal.Title>UPDATE CLIENT INDIVIDUAL{clientIndividual.id}</Modal.Title>
            <button className="btn btn-sm btn-icon btn-active-color-primary" onClick={() => setShow(false)}>
                <KTIcon iconName="cross" className="fs-1" />
            </button>
            </Modal.Header>
            
            <Modal.Body>
            <form onSubmit={formik.handleSubmit}>
                <div className='row g-4 mb-8'>
                    <div className='col-md-4 fv-row'>
                        <label className="required fs-6 fw-semibold mb-2">Client Name</label>
                        <input 
                        type="text" 
                        name="clientName"
                        onChange={formik.handleChange}
                        value={formik.values.clientName}
                        className="form-control" 
                        placeholder="Enter company name"
                        />
                        {formik.touched.clientName && formik.errors.clientName && (
                        <div className='text-danger mt-2'>{formik.errors.clientName}</div>
                        )}
                    </div>
                    <div className='col-md-4 fv-row'>
                        <label className="required fs-6 fw-semibold mb-2">Position</label>
                        <input 
                        type="text" 
                        name="position"
                        onChange={formik.handleChange}
                        value={formik.values.position}
                        className="form-control" 
                        placeholder="Enter industry"
                        />
                        {formik.touched.position && formik.errors.position && (
                        <div className='text-danger mt-2'>{formik.errors.position}</div>
                        )}
                    </div>
                    <div className='col-md-4 fv-row'>
                        <label className="required fs-6 fw-semibold mb-2">Email</label>
                        <input 
                        type="text" 
                        name="industry"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="form-control" 
                        placeholder="Enter industry"
                        />
                        {formik.touched.email && formik.errors.email && (
                        <div className='text-danger mt-2'>{formik.errors.email}</div>
                        )}
                    </div>
                </div>
            </form>
            </Modal.Body>

            <Modal.Footer>
            <Button className='btn btn-sm btn-secondary me-2' onClick={() => setShow(false)}>
                Close
            </Button>
            <Button className='btn btn-sm btn-dark' type="submit" onClick={formik.handleSubmit}>
                {loading ? 'Submitting...' : 'Submit'}
            </Button>
            </Modal.Footer>
        </Modal> */}
    </>
  );
}

export { UpdateClientIndividualModal };

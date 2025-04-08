import { useState } from 'react';
import Swal from 'sweetalert2';
// import { Modal, Button } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CreateCompanyIndividual } from '../../core/request/clients_request';

const companyProfileValidationSchema = Yup.object().shape({

  individuals: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Client Name is required'),
      position: Yup.string().required('Position is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
    })
  ),
});

const FormRepeater = ({ entries, addEntry, removeEntry, handleEntryChange, errors, touched }) => {
  return (
    <div>
      {entries.map((entry, index) => (
        <div key={index} className="row align-items-center mb-3 g-2">
          <div className="col-auto">
            <Button onClick={() => removeEntry(index)} className="btn btn-icon btn-sm btn-light-danger">
              <KTIcon iconName="cross" className='fs-3' />
            </Button>
          </div>
          <div className="col">
            <input
              type="text"
              name={`individuals[${index}].name`}
              placeholder="Client Name"
              onChange={(e) => handleEntryChange(index, e)}
              value={entry.name}
              className="form-control"
            />
            {touched.individuals?.[index]?.name && errors.individuals?.[index]?.name && (
              <div className='text-danger mt-2'>{errors.individuals[index].name}</div>
            )}
          </div>
          <div className="col">
            <input
              type="text"
              name={`individuals[${index}].position`}
              placeholder="Position"
              onChange={(e) => handleEntryChange(index, e)}
              value={entry.position}
              className="form-control"
            />
            {touched.individuals?.[index]?.position && errors.individuals?.[index]?.position && (
              <div className='text-danger mt-2'>{errors.individuals[index].position}</div>
            )}
          </div>
          <div className="col">
            <input
              type="text"
              name={`individuals[${index}].email`}
              placeholder="Email"
              onChange={(e) => handleEntryChange(index, e)}
              value={entry.email}
              className="form-control"
            />
            {touched.individuals?.[index]?.email && errors.individuals?.[index]?.email && (
              <div className='text-danger mt-2'>{errors.individuals[index].email}</div>
            )}
          </div>
        </div>
      ))}
      <Button variant="button" onClick={addEntry} className="mt-3 btn btn-primary btn-sm btn btn-light-primary">
        + Add Item
      </Button>
    </div>
  );
};

function CreateClientIndividualModal({ companyId,onSuccess }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([
    { name: '', position: '', email: '' },
  ]);

  // Handlers for repeater entries
  // const addEntry = () => setEntries([...entries, { name: '', position: '', email: '' }]);
  const validateLastEntry = () => {
    const lastEntry = entries[entries.length - 1];
    return lastEntry.name && lastEntry.position && lastEntry.email;
  };
  
  const addEntry = () => {
    if (validateLastEntry()) {
      setEntries([...entries, { name: '', position: '', email: '' }]);
    } else {
      alert("Please fill in all required fields before adding a new item.");
    }
  };
  const removeEntry = (index) => setEntries(entries.filter((_, i) => i !== index));
  
  const handleEntryChange = (index, event) => {
    const { name, value } = event.target;
    setEntries(entries.map((entry, i) => (i === index ? { ...entry, [name.split('.')[1]]: value } : entry)));
    formik.setFieldValue(`individuals[${index}].${name.split('.')[1]}`, value);
  };

  const formik = useFormik({
    initialValues: {
      individuals: entries,
    },
    validationSchema: companyProfileValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append(`companyId`, companyId);
        
        entries.forEach((entry, index) => {
          formData.append(`individuals[${index}].name`, entry.name);
          formData.append(`individuals[${index}].position`, entry.position);
          formData.append(`individuals[${index}].email`, entry.email);
        });

        const response = await CreateCompanyIndividual(formData);
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
    1
      {/* <Button className="btn btn-dark btn-sm" onClick={() => setShow(true)}>
        New Client
      </Button>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-800px">
        <Modal.Header>
          <Modal.Title>CREATE NEW CLIENT INDIVIDUAL</Modal.Title>
          <button className="btn btn-sm btn-icon btn-active-color-primary" onClick={() => setShow(false)}>
            <KTIcon iconName="cross" className="fs-1" />
          </button>
        </Modal.Header>
        
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <FormRepeater 
              entries={entries}
              addEntry={addEntry}
              removeEntry={removeEntry}
              handleEntryChange={handleEntryChange}
              errors={formik.errors}
              touched={formik.touched}
              values={formik.values.individuals}
            />
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

export { CreateClientIndividualModal };

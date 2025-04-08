import { useState } from 'react';
import Swal from 'sweetalert2';
// import { Modal, Button } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CreateCompanyProfile } from '../../core/request/clients_request';
import { SelectCoreServiceComponent, SelectClientStatusComponent } from '../dropdowns/client_profile_dropdown_component';

const companyProfileValidationSchema = Yup.object().shape({
  logo: Yup.string().max(1000, 'Must be 1000 characters or less').required('Compan Logo is required'),
  name: Yup.string().max(1000, 'Must be 1000 characters or less').required('Company Name is required'),
  industry: Yup.string().max(1000, 'Must be 1000 characters or less').required('Industry is required'),
  website: Yup.string().max(1000, 'Must be 1000 characters or less').required('Website is required'),
  coreServiceId: Yup.string().required('CORE Service is required'),
  clientStatusId: Yup.string().required('Status is required'),
  timezone: Yup.string().required('Timezone is required'),
  timezoneOffset: Yup.string().required('Time Difference is required'),
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
            {/* <Button onClick={() => removeEntry(index)} className="btn btn-icon btn-sm btn-light-danger">
              <KTIcon iconName="cross" className='fs-3' />
            </Button> */}
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
      {/* <Button variant="button" onClick={addEntry} className="mt-3 btn btn-primary btn-sm btn btn-light-primary">
        + Add Item
      </Button> */}
    </div>
  );
};

function MyModal({ onSubmitSuccess }) {
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
      logo: '',
      name: '',
      industry: '',
      website: '',
      timezone: '',
      timezoneOffset: '',
      coreServiceId: '',
      clientStatusId: '',
      individuals: entries,
    },
    validationSchema: companyProfileValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('logo', values.logo);
        formData.append('name', values.name);
        formData.append('industry', values.industry);
        formData.append('website', values.website);
        formData.append('timezone', values.timezone);
        formData.append('timezoneOffset', values.timezoneOffset);
        formData.append('coreServiceId', values.coreServiceId);
        formData.append('clientStatusId', values.clientStatusId);

        // Append repeater entries to FormData
        entries.forEach((entry, index) => {
          formData.append(`individuals[${index}].name`, entry.name);
          formData.append(`individuals[${index}].position`, entry.position);
          formData.append(`individuals[${index}].email`, entry.email);
        });

        const response = await CreateCompanyProfile(formData);
        setShow(false); // Close the modal
        Swal.fire({
          title: 'Success!',
          text: `${response.data.responseText}`,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          if (onSubmitSuccess) {
            onSubmitSuccess(); // Trigger the refresh function
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

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-900px">
        <Modal.Header>
          <Modal.Title>CREATE NEW CLIENT PROFILE</Modal.Title>
          <button className="btn btn-sm btn-icon btn-active-color-primary" onClick={() => setShow(false)}>
            <KTIcon iconName="cross" className="fs-1" />
          </button>
        </Modal.Header>
        
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className='row g-4 mb-8'>
              <div className='col-md-6 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Company Name</label>
                <input 
                  type="text" 
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="form-control" 
                  placeholder="Enter company name"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='text-danger mt-2'>{formik.errors.name}</div>
                )}
              </div>
              <div className='col-md-6 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Industry</label>
                <input 
                  type="text" 
                  name="industry"
                  onChange={formik.handleChange}
                  value={formik.values.industry}
                  className="form-control" 
                  placeholder="Enter industry"
                />
                {formik.touched.industry && formik.errors.industry && (
                  <div className='text-danger mt-2'>{formik.errors.industry}</div>
                )}
              </div>
            </div>
            <div className='row g-4 mb-8'>
              <div className='col-md-6 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Website</label>
                <input 
                  type="text" 
                  name="website"
                  onChange={formik.handleChange}
                  value={formik.values.website}
                  className="form-control"
                  placeholder="Enter website"
                />
                {formik.touched.website && formik.errors.website && (
                  <div className='text-danger mt-2'>{formik.errors.website}</div>
                )}
              </div>
              <div className='col-md-3 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Timezone</label>
                <input 
                  type="text" 
                  name="timezone"
                  onChange={formik.handleChange}
                  value={formik.values.timezone}
                  className="form-control" 
                  placeholder="Enter timezone"
                />
                {formik.touched.timezone && formik.errors.timezone && (
                  <div className='text-danger mt-2'>{formik.errors.timezone}</div>
                )}
              </div>
              <div className='col-md-3 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Time Difference From MNL</label>
                <input 
                  type="number" 
                  name="timezoneOffset"
                  onChange={formik.handleChange}
                  value={formik.values.timezoneOffset}
                  className="form-control" 
                  placeholder="Enter time difference"
                />
                {formik.touched.timezoneOffset && formik.errors.timezoneOffset && (
                  <div className='text-danger mt-2'>{formik.errors.timezoneOffset}</div>
                )}
              </div>
            </div>
            <div className='row g-4 mb-8'>
              <div className='col-md-6 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Company Logo</label>
                <input 
                  type="file" 
                  className="form-control"
                  name="logo"
                  onChange={(event) => formik.setFieldValue('logo', event.currentTarget.files[0])}
                />
                {formik.touched.logo && formik.errors.logo && (
                  <div className='text-danger mt-2'>{formik.errors.logo}</div>
                )}
              </div>
              <div className='col-md-3 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">CORE Service</label>
                <SelectCoreServiceComponent 
                 name="coreServiceId"
                 onChange={formik.handleChange}
                 value={formik.values.coreServiceId}
                 className="form-select" 
                ></SelectCoreServiceComponent>
                {formik.touched.coreServiceId && formik.errors.coreServiceId && (
                  <div className='text-danger mt-2'>{formik.errors.coreServiceId}</div>
                )}
              </div>
              <div className='col-md-3 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Status</label>
                <SelectClientStatusComponent 
                 name="clientStatusId"
                 onChange={formik.handleChange}
                 value={formik.values.clientStatusId}
                 className="form-select" 
                ></SelectClientStatusComponent>
                {formik.touched.clientStatusId && formik.errors.clientStatusId && (
                  <div className='text-danger mt-2'>{formik.errors.clientStatusId}</div>
                )}
              </div>
            </div>

            <div className='separator separator-dashed my-5'></div>
            <h4 className='text-gray-700 mb-3'>CLIENT INDIVIDUAL INFO</h4>

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

export { MyModal };

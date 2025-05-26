import { useState } from 'react';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap';
import { KTIcon } from '../../../../../../_metronic/helpers';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { UpdateCompanyProfile } from '../../core/request/clients_request';
import { SelectCoreServiceComponent, SelectClientStatusComponent } from '../dropdowns/client_profile_dropdown_component';

const companyProfileValidationSchema = Yup.object().shape({
  name: Yup.string().max(1000, 'Must be 1000 characters or less').required('Company Name is required'),
  alias: Yup.string().max(5, 'Must be 5 characters or less').required('Alias is required'),
  industry: Yup.string().max(1000, 'Must be 1000 characters or less').required('Industry is required'),
  website: Yup.string().max(1000, 'Must be 1000 characters or less').required('Website is required'),
  coreServiceId: Yup.string().required('CORE Service is required'),
  departmentStatusId: Yup.string().required('Status is required'),
  timezone: Yup.string().required('Timezone is required'),
  timezoneOffset: Yup.string().required('Time Difference is required'),
});

function ClientUpdateModal({ departmentInfoData, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: departmentInfoData.name,
      industry: departmentInfoData.industry,
      alias: departmentInfoData.alias,
      website: departmentInfoData.website,
      timezone: departmentInfoData.timezone,
      timezoneOffset: departmentInfoData.timezoneOffset,
      coreServiceId: departmentInfoData.coreServiceId,
      departmentStatusId: departmentInfoData.departmentStatusId,
      logo: null,
    },
    validationSchema: companyProfileValidationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('logo', values.logo);
        formData.append('name', values.name);
        formData.append('industry', values.industry);
        formData.append('alias', values.alias);
        formData.append('website', values.website);
        formData.append('timezone', values.timezone);
        formData.append('timezoneOffset', values.timezoneOffset);
        formData.append('coreServiceId', values.coreServiceId);
        formData.append('departmentStatusId', values.departmentStatusId);

        const response = await UpdateCompanyProfile(departmentInfoData.id, formData);
        setShow(false);
        Swal.fire({
          title: 'Success!',
          text: `${response.data.responseText}`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        setStatus(error.message || 'An error occurred');
        Swal.fire({
          title: 'Error!',
          text: error.message || 'An error occurred while updating the profile.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <a className="menu-link px-3" onClick={() => setShow(true)}>
        Update Department Profile
      </a>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-900px">
        <Modal.Header>
          <Modal.Title>UPDATE DEPARTMENT PROFILE</Modal.Title>
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
              <div className='col-md-3 fv-row'>
                <label className="required fs-6 fw-semibold mb-2">Alias</label>
                <input 
                  type="text" 
                  name="alias"
                  onChange={formik.handleChange}
                  value={formik.values.alias}
                  className="form-control" 
                  placeholder="Enter industry"
                />
                {formik.touched.alias && formik.errors.alias && (
                  <div className='text-danger mt-2'>{formik.errors.alias}</div>
                )}
              </div>
              <div className='col-md-3 fv-row'>
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
                 name="departmentStatusId"
                 onChange={formik.handleChange}
                 value={formik.values.departmentStatusId}
                 className="form-select" 
                ></SelectClientStatusComponent>
                {formik.touched.departmentStatusId && formik.errors.departmentStatusId && (
                  <div className='text-danger mt-2'>{formik.errors.departmentStatusId}</div>
                )}
              </div>
            </div>

           
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn btn-sm btn-secondary me-2" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button className="btn btn-sm btn-dark" type="submit" onClick={formik.handleSubmit}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { ClientUpdateModal };

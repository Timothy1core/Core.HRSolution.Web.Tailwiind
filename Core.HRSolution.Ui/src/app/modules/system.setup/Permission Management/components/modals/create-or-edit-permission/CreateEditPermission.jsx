import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { createApiPermission, infoApiPermission, updateApiPermission } from '../../../core/requests/_request';
import { listRole } from '../../../../Role Management/core/requests/_request';
// import { Modal, Button } from 'react-bootstrap';
import { listApi } from '../../../../Api Management/core/requests/_request';
import Select from 'react-select'

const permissionSchema = Yup.object().shape({
  permission: Yup.string()
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
  role: Yup.string().required('Required'),
});

const CreateEditPermission = ({ id, editMode, showModal, handleClose, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [listRoles, setListRole] = useState([]);
  const [listApis, setListApi] = useState([]);
  const [options, setOptions] = useState([]);

  const formik = useFormik({
    initialValues: {
      permission: '',
      role: '',
    },
    validationSchema: permissionSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        let res;
        if (editMode) {
          res = await updateApiPermission(id, values.permission, values.role);
        } else {
          res = await createApiPermission(values.role, values.permission);
        }

        if (res.data.success) handleCloseWithRefresh();
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
      const fetchListRole = async () => {
        try {
          const response = await listRole('','','id','asc', 0, 9999);
          setListRole(response.data.data);
        } catch (error) {
          console.error('Error fetching list Role data:', error);
        }
      };
      const fetchListApi = async () => {
        try {
          const response = await listApi('','','id','asc', 0, 9999);
          setListApi(response.data.data);
          const formattedOptions = response.data.data.map((item) => ({
            value: item.id,
            label: item.apiPermission,
          }));

        setOptions(formattedOptions);

        } catch (error) {
          console.error('Error fetching list Role data:', error);
        }
      };
      fetchListRole();
      fetchListApi();
  }, []);

  useEffect(() => {
    if (editMode) {
      infoApiPermission(id).then(response => {
        formik.setValues({
          permission: response.data.permission.apiId,
          role: response.data.permission.roleId,
        });
      }).catch(error => {
        formik.setStatus('Error fetching permission data');
      });
    } else {
      formik.resetForm();
    }
  }, [id, editMode]);

  return (
    // <Modal show={showModal} onHide={handleClose} centered className='modal-lg'>
    //   <Modal.Header  closeButton><Modal.Title>{editMode ? 'Edit API Permission' : 'Add API Permission'}</Modal.Title></Modal.Header>
    //   <Modal.Body>
            <form onSubmit={formik.handleSubmit}>
              {formik.status && (
                <div className='mb-lg-10 alert alert-danger'>
                  <div className='alert-text font-weight-bold'>{formik.status}</div>
                </div>
              )}
              <div className='fv-row d-flex mb-5'>

                <div  className='me-4 flex-fill'>
                <label className='form-label required'>Role</label>
                  <select
                    className='form-select form-select-solid'
                    {...formik.getFieldProps('role')}
                  >
                    <option value='' hidden>Select Role</option>
                    {listRoles.map((roles) => (
                      <option key={roles.id} value={roles.id}>
                        {roles.role}
                      </option>
                    ))}
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className='text-danger mt-2'>{formik.errors.role}</div>
                  )}
                </div>
                <div className=' flex-fill'>
                  <label className='form-label required'>Permission Name</label>
                  <Select 
                    className='react-select-styled react-select-solid'
                    classNamePrefix='react-select'
                    options={options} 
                    isSearchable={true}
                    isClearable
                    placeholder='Select permission Name' 
                    value={options.find(option => option.value === formik.values.permission) || null}
                    onChange={(selectedOption) => formik.setFieldValue('permission', selectedOption ? selectedOption.value : '')}
                    onBlur={() => formik.setFieldTouched('permission', true)}
                  />
                  {formik.touched.permission && formik.errors.permission && (
                    <div className='text-danger mt-2'>{formik.errors.permission}</div>
                  )}
                </div>
              </div>

              <div className='d-flex flex-center flex-row-fluid pt-12'>
                <button type='reset' className='btn btn-light me-3' data-bs-dismiss='modal'>
                  Cancel
                </button>

                <button
                  type='submit'
                  className='btn btn-danger'
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading && <span className='indicator-label'>Submit</span>}
                  {loading && (
                    <span className='indicator-progress' style={{ display: 'block' }}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </form>
            // </Modal.Body>
            // </Modal>
  );
};

export { CreateEditPermission };

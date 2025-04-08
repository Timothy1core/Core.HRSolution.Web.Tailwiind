import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createRole, infoRole, updateRole } from '../../../core/requests/_request';
// import { Modal, Button } from 'react-bootstrap';

const roleSchema = Yup.object().shape({
  roleName: Yup.string().max(100, 'Must be 100 characters or less').required('Required'),
});

const CreateEditRole = ({ id, editMode, showModal, handleClose, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode) {
      infoRole(id).then(response => {
        formik.setValues({ roleName: response.data.role.role });
      }).catch(error => {
        formik.setStatus('Error fetching role data');
      });
    } else if(!editMode) {
      formik.resetForm();
    }
  }, [id, editMode]);

  const formik = useFormik({
    initialValues: { roleName: '' },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const res = editMode ? await updateRole(id, values.roleName) : await createRole(values.roleName);
      if (res.data.success) handleCloseWithRefresh();
      setLoading(false);
    },
  });

  return (
    // <Modal show={showModal} onHide={handleClose} centered>
    //   <Modal.Header closeButton><Modal.Title>{editMode ? 'Edit Role' : 'Add Role'}</Modal.Title></Modal.Header>
    //   <Modal.Body>
        <form onSubmit={formik.handleSubmit} >
          <div className='text-center'>
          <input name='roleName' className='form-control mb-5' {...formik.getFieldProps('roleName')} />
          {/* <Button variant='danger' type='submit' disabled={loading}>{loading ? 'Loading...' : 'Submit'}</Button> */}
          </div>
        </form>
    //   </Modal.Body>
    // </Modal>
  );
};

export { CreateEditRole };

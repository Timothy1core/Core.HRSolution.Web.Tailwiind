import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getTempIds,createTemporaryId } from '../../core/requests/_request';
import { Modal, Button } from 'react-bootstrap';

const roleSchema = Yup.object().shape({
  bioId: Yup.number().typeError('Employee Id must be a number').required('Employee Id is required')
});

const AddTemporaryBioIdModal = ({ id, showModal, handleClose, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [maxId, setMaxId] = useState();
  const fetchTempIds = async () => {
      try {
        const res = await getTempIds();
        if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
          const filteredIds = res.data.data.filter(id => typeof id === 'number');
          setIds(filteredIds);
          setMaxId(filteredIds.length ? Math.max(...filteredIds) : null);
        }
      } catch (error) {
        console.error('Error fetching onboarding info:', error);
      }
    };

  useEffect(() => {
    console.log(showModal)
    if(showModal){
      fetchTempIds();
    }
    }, [showModal]);

  const formik = useFormik({
    initialValues: { bioId: '' },
    validationSchema: roleSchema,
    onSubmit: async (values) => {
      const enteredId = Number(values.bioId);
      if (ids.includes(enteredId)) {
        alert(`Employee ID ${enteredId} already exists. Please enter a different ID.`);
        return;
      }
      setLoading(true);
      const res = await createTemporaryId(id, values.bioId);
      if (res.data.success) handleCloseWithRefresh();
      Swal.fire({
                    title: 'Updated!',
                    text: `Employee Id Successfully Updated`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                  })
      setLoading(false);
    },
  });
  
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Set Employee Id</Modal.Title></Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit} >
          <div >
            <div className='mb-5 text-left'>
            <input name='bioId' className='form-control' {...formik.getFieldProps('bioId')} />
            <span class="form-hint ">
              Suggested Id: <b>{maxId ? maxId + 1 : 'N/A'}</b>
            </span>
            </div>
          <div className='text-center'>
          <Button variant='danger' type='submit' disabled={loading}>{loading ? 'Loading...' : 'Submit'}</Button>
          </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export { AddTemporaryBioIdModal };

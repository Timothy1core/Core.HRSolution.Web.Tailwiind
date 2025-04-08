import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { createMenu, infoMenu, updateMenu, listMenuDropDown } from '../../../core/requests/_request';
import { listSectionMenu } from '../../../../Section Menu Management/core/requests/_request';
// import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select'

const menuSchema = Yup.object().shape({
  menuName: Yup.string()
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
  menuPath: Yup.string()
    .max(100, 'Must be 100 characters or less')
    .required('Required'),
  sectionMenu: Yup.string().required('Required'),
  // menuIcon: Yup.string().required('Required'),
  orderBy: Yup.number().required('Required').typeError('Must be a number'),
});

const CreateEditMenu = ({ id, editMode, showModal, handleClose, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [listMenus, setListMenu] = useState([]);
  const [listSectionMenus, setListSectionMenu] = useState([]);

  const handleCloseModal = () => {
    // formik.resetForm();
    handleClose();
  };
  const formik = useFormik({
    initialValues: {
      menuName: '',
      menuPath: '',
      menuIcon: '',
      orderBy: '',
      isParent: false,
      isSubParent: false,
      sectionMenu: '',
      parent: ''
    },
    validationSchema: menuSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        let res;
        if (editMode) {
          res = await updateMenu(
            id,
            1, 
            values.menuName, 
            values.menuPath, 
            values.isParent, 
            values.isSubParent, 
            values.sectionMenu, 
            values.parent ? values.parent : null,
            values.menuIcon ? values.menuIcon : null,
            values.orderBy
          );
          formik.resetForm();
        } else {
          res = await createMenu(
            1, 
            values.menuName, 
            values.menuPath, 
            values.isParent, 
            values.isSubParent, 
            values.sectionMenu, 
            values.parent ? values.parent : null,
            values.menuIcon ? values.menuIcon : null,
            values.orderBy
          );
          formik.resetForm();
        }

        if (res.data.success) {
          formik.resetForm();
          handleCloseWithRefresh();
        }
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
        // formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (editMode) {
      console.log('test', )
      infoMenu(id).then(response => {
        formik.setValues({ 
          menuName: response.data.menu.menuName,
          menuPath: response.data.menu.menuPath,
          sectionMenu: response.data.menu.sectionMenuId,
          menuIcon: response.data.menu.menuIcon || '',
          orderBy: response.data.menu.orderBy,
          isParent: response.data.menu.isParent,
          isSubParent: response.data.menu.isSubParent,
          parent: response.data.menu.parentId || '',
        });
      }).catch(error => {
        formik.setStatus('Error fetching menu data');
      });
    } else if(!editMode) {
      formik.resetForm();
    }
  }, [id, editMode]);

  useEffect(() => {

      const fetchListMenu = async () => {
        try {
          const response = await listMenuDropDown('','', 'id', 'asc', 0, 9999);
          const formattedOptions = response.data.data.map((item) => ({
            value: item.id,
            label: item.menuName,
          }));
          setListMenu(formattedOptions);
        } catch (error) {
          console.error('Error fetching list menu data:', error);
        }
      };
      fetchListMenu();

      const fetchListSectionMenu = async () => {
        try {
          const response = await listSectionMenu('','','id','asc', 0, 9999);
          const formattedOptions = response.data.data.map((item) => ({
            value: item.id,
            label: item.sectionName,
          }));
          setListSectionMenu(formattedOptions);
        } catch (error) {
          console.error('Error fetching section menu data:', error);
        }
      };
      fetchListSectionMenu();
  }, []);

  return (
    // <Modal show={showModal} onHide={handleCloseModal} centered className=' modal-lg'>
    //   <Modal.Header closeButton><Modal.Title>{editMode ? 'Edit Menu' : 'Add Menu'}</Modal.Title></Modal.Header>
    //   <Modal.Body>
            <form onSubmit={formik.handleSubmit}>
              {formik.status && (
                <div className='mb-lg-10 alert alert-danger'>
                  <div className='alert-text font-weight-bold'>{formik.status}</div>
                </div>
              )}
              {/* 1st Row */}
              <div className='fv-row d-flex mb-5'>
                <div className='me-4 flex-fill'>
                  <label className='form-label required'>Menu Name</label>
                  <input
                    name='menuName'
                    className='form-control form-control-lg form-control-solid'
                    {...formik.getFieldProps('menuName')}
                  />
                  {formik.touched.menuName && formik.errors.menuName && (
                    <div className='text-danger mt-2'>{formik.errors.menuName}</div>
                  )}
                </div>
                <div  className='flex-fill'>
                  <a
                        data-toggle="tooltip" title="The Menu Path needs to start with '/'"
                      >
                        <KTIcon iconName='question-2' className='fs-2' />
                  </a>
                  <label className='form-label required mb-1'>Menu Path</label>
                  <input
                    name='menuPath'
                    className='form-control form-control-lg form-control-solid'
                    {...formik.getFieldProps('menuPath')}
                  />
                  {formik.touched.menuPath && formik.errors.menuPath && (
                    <div className='text-danger mt-2'>{formik.errors.menuPath}</div>
                  )}
                </div>
              </div>
              {/* 2nd Row */}
              <div className='fv-row d-flex mb-5 gap-4'>
                <div className='me-4 flex-fill'>
                  <label className='form-label required'>Is it a Parent?</label>
                  <div className="form-check form-check-custom form-check-solid d-flex">
                    <div className='flex-fill'>
                      <input 
                      className="form-check-input" 
                      name='isParent' 
                      type="radio" 
                      value="true" 
                      checked={formik.values.isParent === true}
                      onChange={() => formik.setFieldValue("isParent", true)}
                      />
                      <label className="form-check-label me-5">
                          Yes
                      </label>
                    </div>
                    <div className='flex-fill'>
                      <input 
                      className="form-check-input" 
                      name='isParent' 
                      type="radio" 
                      value="false" 
                      checked={formik.values.isParent === false}
                      onChange={() => formik.setFieldValue("isParent", false)}
                      />
                      <label className="form-check-label">
                          No
                      </label>
                    </div>
                  </div>
                  {formik.touched.isParent && formik.errors.isParent && (
                  <div className='text-danger mt-2'>{formik.errors.isParent}</div>
                   )}
                </div>
                <div className='flex-fill'>
                  <label className='form-label required'>Is it a Sub Parent?</label>
                  <div className="form-check form-check-custom form-check-solid d-flex">
                    <div className='flex-fill'>
                      <input 
                      className="form-check-input" 
                      name='isSubParent' 
                      type="radio" 
                      value="true"
                      checked={formik.values.isSubParent === true}
                      onChange={() => formik.setFieldValue("isSubParent", true)}/>
                      <label className="form-check-label me-5">
                          Yes
                      </label>
                    </div>
                    <div className='flex-fill'>
                      <input 
                      className="form-check-input" 
                      name='isSubParent' 
                      type="radio" 
                      value="false"
                      checked={formik.values.isSubParent === false}
                      onChange={() => formik.setFieldValue("isSubParent", false)}/>
                      <label className="form-check-label">
                          No
                      </label>
                    </div>
                  </div>
                  {formik.touched.isSubParent && formik.errors.isSubParent && (
                  <div className='text-danger mt-2'>{formik.errors.isSubParent}</div>
                   )}
                </div>
              </div>
              {/* 3rd Row */}
              <div className='fv-row d-flex mb-5'>
                <div className='me-4 flex-fill'>
                  <label className='form-label required'>Section Menu</label>
                  <Select 
                    className='react-select-styled react-select-solid'
                    classNamePrefix='react-select'
                    options={listSectionMenus} 
                    isSearchable={true}
                    isClearable
                    placeholder='Select Parent Menu' 
                    value={listSectionMenus.find(option => option.value === formik.values.sectionMenu) || null}
                    onChange={(selectedOption) => formik.setFieldValue('sectionMenu', selectedOption ? selectedOption.value : '')}
                    onBlur={() => formik.setFieldTouched('sectionMenu', true)}
                  />
                  {formik.touched.sectionMenu && formik.errors.sectionMenu && (
                    <div className='text-danger mt-2'>{formik.errors.sectionMenu}</div>
                  )}
                </div>
                <div className='flex-fill'>
                  <label className='form-label'>Parent</label>
                  <Select 
                    className='react-select-styled react-select-solid'
                    classNamePrefix='react-select'
                    options={listMenus} 
                    isSearchable={true}
                    isClearable
                    placeholder='Select Parent Menu' 
                    value={listMenus.find(option => option.value === formik.values.parent) || null}
                    onChange={(selectedOption) => formik.setFieldValue('parent', selectedOption ? selectedOption.value : '')}
                    onBlur={() => formik.setFieldTouched('parent', true)}
                  />
                </div>
              </div>
              {/* 4th Row */}
              <div className='fv-row d-flex mb-5'>
                <div className='me-4 flex-fill'>
                  <label className='form-label'>Menu Icon</label>
                  <input
                    name='menuIcon'
                    className='form-control form-control-lg form-control-solid'
                    {...formik.getFieldProps('menuIcon')}
                  />
                </div>
                <div  className='flex-fill'>
                  <label className='form-label required'>Order By</label>
                  <input
                    name='orderBy'
                    className='form-control form-control-lg form-control-solid'
                    {...formik.getFieldProps('orderBy')}
                  />
                  {formik.touched.orderBy && formik.errors.orderBy && (
                    <div className='text-danger mt-2'>{formik.errors.orderBy}</div>
                  )}
                </div>
              </div>

              <div className='d-flex flex-center flex-row-fluid pt-12'>
                <button type='reset'  onChange={() => handleClose()} className='btn btn-light me-3' data-bs-dismiss='modal'>
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

export { CreateEditMenu };

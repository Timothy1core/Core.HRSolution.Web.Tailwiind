import { useState,useEffect } from 'react';
// import { Modal } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, List, Heading, Link, Table, TableToolbar, Indent, IndentBlock, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Base64UploadAdapter, FontSize } from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import { createCalendarEvent } from '../../core/requests/_request';

const eventSchema = Yup.object().shape({
  subject: Yup.string().required('Required'),
  body: Yup.string().required('Required'),
  startTime: Yup.string().required('Required'),
  endTime: Yup.string().required('Required'),
  timeZone: Yup.string().required('Required'),
  attendeesEmails: Yup.array().min(1, 'At least one attendee is required'),
});

const CalendarEventModal = ({ show, handleClose, handleCloseRefresh, fromUserEmail, candidateEmail }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    { value: candidateEmail, label: candidateEmail },
  ]);
  const timeZoneOptions = [
    { value: 'Pacific Standard Time', label: 'Pacific Standard Time' },
    { value: 'Eastern Standard Time', label: 'Eastern Standard Time' },
    { value: 'W. Europe Standard Time', label: 'W. Europe Standard Time' },
    { value: 'Singapore Standard Time', label: 'Singapore Standard Time' },
    { value: 'Philippines Standard Time', label: 'Philippines Standard Time' },
    { value: 'UTC', label: 'UTC' },
  ];
  const CKEditorConfig = {
    plugins: [
      Essentials, Bold, Italic, Paragraph, List, Heading, Link,
      Table, TableToolbar, Indent, IndentBlock, Image,
      ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload,
      Base64UploadAdapter, FontSize
    ],
    toolbar: [
      'undo', 'redo', '|',
      'heading', '|',
      'bulletedList', 'numberedList', '|',
      'bold', 'italic', '|',
      'insertTable', '|', 'indent', 'outdent',
    ],
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    viewportTopOffset: 60
  };

  const formik = useFormik({
    initialValues: {
      subject: '',
      body: '',
      startTime: '',
      endTime: '',
      timeZone: '',
      attendeesEmails: [],
    },
    validationSchema: eventSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('FromUserEmail', fromUserEmail);
        formData.append('Subject', values.subject);
        formData.append('Body', values.body);
        formData.append('StartTime', new Date(values.startTime).toISOString());
        formData.append('EndTime', new Date(values.endTime).toISOString());
        formData.append('TimeZone', values.timeZone);
        formData.append('AttendeesEmails', values.attendeesEmails);
        const res = await createCalendarEvent(formData);
        


        if (res.status == 200) {
          Swal.fire('Submitted!', 'The Candidate Correction has been submitted.', 'success');
          setStatus('success');
          formik.resetForm();
          handleCloseRefresh();
          Swal.fire('Success', 'Event has been created successfully!', 'success');
        } else {
          Swal.fire(
            'Correction Failed!',
            res?.data?.responseText || 'An unexpected error occurred.',
            'warning'
          );
        }      
        
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const handleChange = (selected) => {
    formik.setFieldValue(
      'attendeesEmails',
      selected.map((option) => option.value)
    );
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions([...options, newOption]);
    formik.setFieldValue('attendeesEmails', [...formik.values.attendeesEmails, inputValue]);
  };

  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
  }, [show, fromUserEmail, candidateEmail]);

  return (
    <>1</>
    // <Modal
    //   className='modal-sticky modal-lg'
    //   show={show}
    //   onHide={handleClose}
    //   animation={false}
    // >
    //   <div className='modal-content'>
    //     <div className='d-flex align-items-center justify-content-between py-5 px-8 border-bottom'>
    //       <h5 className='fw-bold m-0'>Create Calendar Event</h5>
    //       <div className='btn btn-icon btn-sm btn-light-danger' onClick={handleClose}>
    //         <KTIcon className='fs-1' iconName='cross' />
    //       </div>
    //     </div>

    //     <div className="card w-100">
    //       <form onSubmit={formik.handleSubmit}>
    //         {formik.status && <div className="alert alert-danger">{formik.status}</div>}

    //         <div className="card-body">
    //           {/* <label className="form-label">From Email</label>
    //           <input className="form-control" {...formik.getFieldProps('fromUserEmail')} />
    //           {formik.errors.fromUserEmail && <div className="text-danger mt-2">{formik.errors.fromUserEmail}</div>} */}

    //           <label className="form-label">Subject</label>
    //           <input className="form-control" {...formik.getFieldProps('subject')} />
    //           {formik.errors.subject && <div className="text-danger mt-2">{formik.errors.subject}</div>}

    //           <label className="form-label">Body</label>
    //           <CKEditor
    //             editor={ClassicEditor}
    //             config={CKEditorConfig}
    //             data={formik.values.body}
    //             onChange={(event, editor) => formik.setFieldValue('body', editor.getData())}
    //           />
    //           {formik.errors.body && <div className="text-danger mt-2">{formik.errors.body}</div>}

    //           <div className="row my-2">
    //             <div className="col-md-6">
    //               <label className="form-label">Start Time</label>
    //               <input type="datetime-local" className="form-control" {...formik.getFieldProps('startTime')} />
    //               {formik.errors.startTime && <div className="text-danger mt-2">{formik.errors.startTime}</div>}
    //             </div>
    //             <div className="col-md-6">
    //               <label className="form-label">End Time</label>
    //               <input type="datetime-local" className="form-control" {...formik.getFieldProps('endTime')} />
    //               {formik.errors.endTime && <div className="text-danger mt-2">{formik.errors.endTime}</div>}
    //             </div>
    //           </div>

    //           <label className="form-label">Time Zone</label>
    //           <select
    //             className="form-control"
    //             {...formik.getFieldProps('timeZone')}
    //           >
    //             <option value="">Select Time Zone</option>
    //             {timeZoneOptions.map((zone) => (
    //               <option key={zone.value} value={zone.value}>
    //                 {zone.label}
    //               </option>
    //             ))}
    //           </select>
    //           {formik.errors.timeZone && <div className="text-danger mt-2">{formik.errors.timeZone}</div>}

    //           <label className="form-label mt-2">Attendees Emails</label>
    //           <CreatableSelect
    //             // options={options}
    //             isMulti
    //             value={options.filter(opt => formik.values.attendeesEmails.includes(opt.value))}
    //             onChange={handleChange}
    //             onCreateOption={handleCreate}
    //             className="basic-multi-select "
    //             classNamePrefix="select"
    //             placeholder="Type and press Enter to add..."
    //           />
    //           {formik.errors.attendeesEmails && <div className="text-danger mt-2">{formik.errors.attendeesEmails}</div>}
    //         </div>

    //         <div className="card-footer text-center">
    //           <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>
    //             Cancel
    //           </button>
    //           <button type="submit" className="btn btn-danger" disabled={loading || formik.isSubmitting}>
    //             {loading ? 'Saving...' : 'Create Event'}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </Modal>
  );
};

export { CalendarEventModal };

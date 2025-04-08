import { KTIcon } from '@/_metronic/helpers';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import CreatableSelect from "react-select/creatable";

const eventSchema = Yup.object().shape({
  fromUserEmail: Yup.string().email('Invalid email').required('Required'),
  subject: Yup.string().required('Required'),
  body: Yup.string().required('Required'),
  startTime: Yup.string().required('Required'),
  endTime: Yup.string().required('Required'),
  timeZone: Yup.string().required('Required'),
  attendeesEmails: Yup.string().required('Required'),
});

const CalendarEvent = ({ handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [options, setOptions] = useState([
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions([...options, newOption]); // Add new option to list
    setSelectedOptions([...selectedOptions, newOption]); // Select the new option
  };

  const formik = useFormik({
    initialValues: {
      fromUserEmail: '',
      subject: '',
      body: '',
      startTime: '',
      endTime: '',
      timeZone: '',
      attendeesEmails: '',
    },
    validationSchema: eventSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      try {
        const requestData = {
          fromUserEmail: values.fromUserEmail,
          subject: values.subject,
          body: values.body,
          startTime: new Date(values.startTime).toISOString(),
          endTime: new Date(values.endTime).toISOString(),
          timeZone: values.timeZone,
          attendeesEmails: values.attendeesEmails.split(',').map(email => email.trim()),
        };

        await CreateCalendarEventAsync(
          requestData.fromUserEmail,
          requestData.subject,
          requestData.body,
          requestData.startTime,
          requestData.endTime,
          requestData.timeZone,
          requestData.attendeesEmails
        );

        setStatus('success');
        formik.resetForm();
        handleClose();
        Swal.fire('Success', 'Event has been created successfully!', 'success');
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div
    id="kt_drawer_create_event"
      className="bg-white"
      data-kt-drawer="true"
      data-kt-drawer-activate="true"
      data-kt-drawer-toggle="#kt_drawer_create_event_button"
      data-kt-drawer-close="#kt_drawer_create_event_close"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'300px', 'md': '500px'}"
      >
      <div className="card rounded-0 w-100">
        <form onSubmit={formik.handleSubmit}>
          {formik.status && <div className="alert alert-danger">{formik.status}</div>}

          <div className="card-header pe-5">
            <div className="card-title">Create Calendar Event</div>
            <div className="card-toolbar">
              <button type="button" className="btn btn-sm btn-icon btn-light-danger" id="kt_drawer_create_event_close" onClick={handleClose}>
                <KTIcon iconName="cross" className="fs-3" />
              </button>
            </div>
          </div>

          <div className="card-body">
            <label className="form-label">From Email</label>
            <input className="form-control" {...formik.getFieldProps('fromUserEmail')} />
            {formik.errors.fromUserEmail && <div className="text-danger mt-2">{formik.errors.fromUserEmail}</div>}

            <label className="form-label">Subject</label>
            <input className="form-control" {...formik.getFieldProps('subject')} />
            {formik.errors.subject && <div className="text-danger mt-2">{formik.errors.subject}</div>}

            <label className="form-label">Body</label>
            <textarea className="form-control" {...formik.getFieldProps('body')} />
            {formik.errors.body && <div className="text-danger mt-2">{formik.errors.body}</div>}

            <label className="form-label">Start Time</label>
            <input type="datetime-local" className="form-control" {...formik.getFieldProps('startTime')} />
            {formik.errors.startTime && <div className="text-danger mt-2">{formik.errors.startTime}</div>}

            <label className="form-label">End Time</label>
            <input type="datetime-local" className="form-control" {...formik.getFieldProps('endTime')} />
            {formik.errors.endTime && <div className="text-danger mt-2">{formik.errors.endTime}</div>}

            <label className="form-label">Time Zone</label>
            <input className="form-control" {...formik.getFieldProps('timeZone')} />
            {formik.errors.timeZone && <div className="text-danger mt-2">{formik.errors.timeZone}</div>}

            <label className="form-label">Attendees Emails (comma separated)</label>
            <input className="form-control" {...formik.getFieldProps('attendeesEmails')} />
            {formik.errors.attendeesEmails && <div className="text-danger mt-2">{formik.errors.attendeesEmails}</div>}

            <h2>React Bootstrap Multi-Select</h2>

            {/* Multi-Select Input */}
            <label>Select Options:</label>
            <CreatableSelect
              options={options}
              isMulti
              value={selectedOptions}
              onChange={handleChange}
              onCreateOption={handleCreate}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Type and press Enter to add..."
            />

            {/* Display Selected Values */}
            <div className="mt-3">
              <strong>Selected:</strong>{" "}
              {selectedOptions.map((opt) => opt.label).join(", ")}
            </div>
          </div>

          <div className="card-footer text-center">
            <button type="button" className="btn btn-secondary me-2" id="kt_drawer_create_event_close" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading || formik.isSubmitting}>
              {loading ? 'Saving...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { CalendarEvent };

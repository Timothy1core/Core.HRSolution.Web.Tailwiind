import { KTIcon } from '@/_metronic/helpers';
import { MoveToJob } from '../../core/requests/_request';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
// import { Offcanvas  } from 'react-bootstrap';

const jobSchema = Yup.object().shape({
  job: Yup.string().required('Required'),
  stage: Yup.string().required('Required'),
});

const CopyToJobWrapper = ({ candidateData, handleClose, jobData, applicationProcessesData, handleShow, handleCloseWithRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [stageName, setStageName] = useState('');
  const [jobName, setJobName] = useState('');
  const [filteredApplicationProcesses, setFilteredApplicationProcesses] = useState([]);

  const formik = useFormik({
    initialValues: { 
      stage: '',
      job: ''
    },
    validationSchema: jobSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('CandidateId', candidateData.id);
      formData.append('FirstName', candidateData.firstName);
      formData.append('LastName', candidateData.lastName);
      formData.append('Email', candidateData.email);
      formData.append('Phone', candidateData.phoneNumber);
      formData.append('CurrentSalary', candidateData.currentSalary);
      formData.append('ExpectedSalary', candidateData.expectedSalary);
      formData.append('CurrentEmploymentStatus', candidateData.currentEmploymentStatus);
      formData.append('NoticePeriod', candidateData.noticePeriod);
      formData.append('Resume', candidateData.resume);
      formData.append('JobId', values.job);
      formData.append('ApplicationStatusId', values.stage);
      formData.append('SourceId', candidateData.sourceId);
      formData.append('JobName', jobName);
      formData.append('StageName', stageName);
      try {
        let res = await MoveToJob(formData);
        if (res.data.success) {
          setStatus('success');
          formik.resetForm();
          Swal.fire({
                        title: 'Updated!',
                        text: `Job has been Updated Successfully!`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                      }).then((result) => {
                          if (result.isConfirmed) {
                            formik.resetForm();
                            handleCloseWithRefresh()
                          }
                      }); 
        }
        formik.resetForm();
      } catch (error) {
        console.error(error);
        setStatus(error.response.data.title || error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const handleStageChange = (e) => {
    const selectedStageId = e.target.value;
    const selectedStage = filteredApplicationProcesses.find(
      (process) => process.applicationProcessId == selectedStageId
    );

    setStageName(selectedStage?.applicationProcess.processName || '');
    formik.setFieldValue('stage', selectedStageId);
  };

  const handleJobChange = (e) => {
    const selectedJobId = e.target.value;
    const selectedJob = jobData.find(
      (job) => job.id == selectedJobId
    );

    setJobName(selectedJob?.position || '');
    formik.setFieldValue('job', selectedJobId);

    setFilteredApplicationProcesses(selectedJob.jobApplicationProcesses);

    formik.setFieldValue('stage', ''); // Reset stage on job change
  };

  useEffect(() => {
    if (jobData?.length > 0 && applicationProcessesData?.length > 0) {
      const currentJobData = jobData.find((job) => job.id === candidateData.jobId);
      const currentStageData = applicationProcessesData.find((process) => process.applicationProcessId === candidateData.applicationStatusId);

      formik.setValues({
        job: candidateData.jobId,
        stage: candidateData.applicationStatusId,
      });

      setJobName(currentJobData?.position || '');
      setStageName(currentStageData?.applicationProcess.processName || '');

      setFilteredApplicationProcesses(currentJobData.jobApplicationProcesses);
    }
  }, [candidateData.jobId, jobData, candidateData.applicationStatusId, applicationProcessesData]);

  return (
    // <Offcanvas show={handleShow} onHide={handleClose} placement="end">
    // <Offcanvas.Header closeButton>
    //     <Offcanvas.Title>Copy To job</Offcanvas.Title>
    //   </Offcanvas.Header>
    //   <Offcanvas.Body>
        <form onSubmit={formik.handleSubmit}>
          <div className="card-body hover-scroll-overlay-y">
            <label className="form-label">Job</label>
            <select
              className="form-select form-select-solid mb-9"
              {...formik.getFieldProps('job')}
              onChange={handleJobChange}
            >
              <option value="" hidden>Select job</option>
              {jobData.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.position}
                </option>
              ))}
            </select>
            {formik.touched.job && formik.errors.job && (
              <div className="text-danger mt-2">{formik.errors.job}</div>
            )}

            <label className="form-label">Stage</label>
            <select
              className="form-select form-select-solid"
              {...formik.getFieldProps('stage')}
              onChange={handleStageChange}
              disabled={!filteredApplicationProcesses.length}
            >
              <option value="" hidden>Select stage</option>
              {filteredApplicationProcesses.map((process) => (
                <option key={process.applicationProcessId} value={process.applicationProcessId}>
                  {process.applicationProcess.processName}
                </option>
              ))}
            </select>
            {formik.touched.stage && formik.errors.stage && (
              <div className="text-danger mt-2">{formik.errors.stage}</div>
            )}
          </div>

          <div className="card-footer">
            <div className="mt-4 text-center">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading || formik.isSubmitting}
              >
                {loading ? 'Saving...' : 'Copy'}
              </button>
            </div>
          </div>
        </form>
        // </Offcanvas.Body>
        // </Offcanvas>
  );
};

export { CopyToJobWrapper };

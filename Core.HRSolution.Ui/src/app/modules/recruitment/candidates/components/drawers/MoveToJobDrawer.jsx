import { KTIcon } from '@/_metronic/helpers';
import { updateJob } from '../../core/requests/_request';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const jobSchema = Yup.object().shape({
  stage: Yup.string().required('Required'),
  job: Yup.string().required('Required'),
});

const MoveToJobWrapper = ({
  applicationProcessesData,
  jobData,
  currentJob,
  candidateId,
  currentStage,
  handleClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [stageName, setStageName] = useState('');
  const [jobName, setJobName] = useState('');
  const [filteredApplicationProcesses, setFilteredApplicationProcesses] = useState([]);

  const formik = useFormik({
    initialValues: {
      stage: '',
      job: '',
    },
    validationSchema: jobSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setLoading(true);
      try {
        const res = await updateJob(
          candidateId,
          values.stage,
          stageName,
          values.job,
          jobName
        );
        if (res.data.success) {
          setStatus('success');
          formik.resetForm();
          const closeButton = document.getElementById('kt_drawer_move_to_job_close');
          if (closeButton) {
            closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            handleClose();
          }
          Swal.fire('Updated', 'Job has been Updated Successfully!', 'success');
        }
      } catch (error) {
        console.error(error);
        setStatus(error.response?.data?.title || error.message || 'An error occurred');
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

    setStageName(selectedStage?.applicationProcess.processName);
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
      const currentJobData = jobData.find((job) => job.id === currentJob);
      const currentStageData = applicationProcessesData.find(
        (process) => process.applicationProcessId === currentStage
      );

      formik.setValues({
        job: currentJob,
        stage: currentStage,
      });

      setJobName(currentJobData?.position || '');
      setStageName(currentStageData?.applicationProcess.processName);

      setFilteredApplicationProcesses(currentJobData?.jobApplicationProcesses || []);
    }
  }, [currentJob, jobData, currentStage, applicationProcessesData]);

  return (
    <div
      id="kt_drawer_move_to_job"
      className="bg-white"
      data-kt-drawer="true"
      data-kt-drawer-activate="true"
      data-kt-drawer-toggle="#kt_drawer_move_to_job_button"
      data-kt-drawer-close="#kt_drawer_move_to_job_close"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'300px', 'md': '500px'}"
    >
      <div className="card rounded-0 w-100">
        <form onSubmit={formik.handleSubmit}>
          {formik.status && (
            <div className="mb-lg-10 alert alert-danger">
              <div className="alert-text font-weight-bold">{formik.status}</div>
            </div>
          )}
          <div className="card-header pe-5">
            <div className="card-title">Move To Job</div>
            <div className="card-toolbar">
              <div
                className="btn btn-sm btn-icon btn-active-light-danger"
                id="kt_drawer_move_to_job_close"
              >
                <KTIcon iconName="cross" className="fs-3" />
              </div>
            </div>
          </div>

          <div className="card-body hover-scroll-overlay-y">
            <label className="form-label">Job</label>
            <select
              className="form-select form-select-solid mb-9"
              {...formik.getFieldProps('job')}
              onChange={handleJobChange}
            >
              <option value="" hidden>
                Select job
              </option>
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
              <option value="" hidden>
                Select stage
              </option>
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
                id="kt_drawer_example_basic_close"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading || formik.isSubmitting}
              >
                {loading ? 'Saving...' : 'Move'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { MoveToJobWrapper };

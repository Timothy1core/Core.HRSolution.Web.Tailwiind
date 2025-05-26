import React, { useState, useEffect, useCallback, memo } from 'react';
import Swal from 'sweetalert2';
import {
    CreateJobApplicationProcess,
    SelectAvailableAssessment,
    CreateJobAssessment,
    SelectApplicationProcess,
} from '../../core/request/job_profile_request';
import {
    enableLoadingRequest,
    disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import { useParams } from 'react-router-dom';

const JobWorkflowComponent = ({ hasApplicationProcess, jobAssessments = [] }) => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [assessment, setAssessment] = useState(jobAssessments);
    const [workflowSteps, setWorkflowSteps] = useState({});
    const [isFormSaved, setIsFormSaved] = useState(false);

    const fetchAssessments = useCallback(async () => {
        try {
            const response = await SelectAvailableAssessment();
            setData(response?.data.data || []);
        } catch {
            showAlert('Error', 'Failed to fetch assessments.', 'error');
        }
    }, []);

    const fetchWorkflows = useCallback(async () => {
        try {
            const response = await SelectApplicationProcess();
            const steps = response.data.applicationProcess || [];
            const stepsMap = steps.reduce((acc, step) => {
                acc[step.id] = {
                    ...step,
                    checked: true,
                };
                return acc;
            }, {});
            setWorkflowSteps(stepsMap);
        } catch {
            showAlert('Error', 'Failed to fetch workflow steps.', 'error');
        }
    }, []);

    useEffect(() => {
        fetchAssessments();
        fetchWorkflows();
    }, [fetchAssessments, fetchWorkflows]);

    const showAlert = (title, text, icon) => {
        Swal.fire({ title, text, icon, confirmButtonText: 'OK' });
    };

    const handleWorkflowCheckboxChange = (stepId) => {
        setWorkflowSteps((prev) => ({
            ...prev,
            [stepId]: {
                ...prev[stepId],
                checked: !prev[stepId]?.checked,
            },
        }));
    };

    const handleWorkflowSubmit = async (event) => {
        event.preventDefault();
        enableLoadingRequest();

        const selectedSteps = Object.entries(workflowSteps)
            .filter(([_, step]) => step.checked)
            .map(([stepId]) => parseInt(stepId));

        if (!selectedSteps.length) {
            showAlert('Warning', 'Please select at least one step.', 'warning');
            disableLoadingRequest();
            return;
        }

        const payload = { JobId: id, ApplicationProcessId: selectedSteps };

        try {
            const response = await CreateJobApplicationProcess(payload);
            showAlert('Success!', response.data.responseText, 'success');
            setIsFormSaved(true);
        } catch {
            showAlert('Error', 'Failed to submit workflow steps.', 'error');
        } finally {
            disableLoadingRequest();
        }
    };

    const handleUpdateAssessment = (id) => {
        const selectedAssessment = data.find((item) => item.id === id);
        if (!selectedAssessment) return;

        const updatedAssessment = [...assessment];
        const indexToUpdate = updatedAssessment.findIndex(
            (item) => item.assessmentId === null
        );

        if (indexToUpdate !== -1) {
            updatedAssessment[indexToUpdate] = {
                ...updatedAssessment[indexToUpdate],
                assessmentId: id,
                name: selectedAssessment.name,
            };
            setAssessment(updatedAssessment);
        }
    };

    const handleRemoveAssessment = (id) => {
        const updatedAssessment = assessment.map((item) =>
            item.assessmentId === id ? { ...item, assessmentId: null, name: null } : item
        );
        setAssessment(updatedAssessment);
    };

    const handleAssessmentsSubmit = async (event) => {
        event.preventDefault();
        enableLoadingRequest();

        const jobApplicationAssessment = assessment.map((item) => ({
            id: item.id,
            assessmentId: item.assessmentId,
        }));

        try {
            const response = await CreateJobAssessment({ jobApplicationAssessment });
            showAlert('Success!', response.data.responseText, 'success');
            setIsFormSaved(true);
        } catch {
            showAlert('Error', 'Failed to submit assessments.', 'error');
        } finally {
            disableLoadingRequest();
        }
    };

    const renderAvailableAssessments = () => {
        const availableAssessments = data.filter(
            (item) => !assessment.some((a) => a.assessmentId === item.id)
        );

        return (
            <div className="row g-3 g-xl-3">
                {availableAssessments.length > 0 ? (
                    availableAssessments.map((item) => (
                        <div
                            className="col-4"
                            key={`availassessment-${item.id}`}
                            onClick={() => handleUpdateAssessment(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card card-xl-stretch mb-xl-8">
                                <div className="card-body">
                                    <div className="card-p">
                                        <div className="d-flex flex-column w-100">
                                            <a
                                                href="#"
                                                className="text-gray-900 text-hover-primary fw-bold fs-3"
                                            >
                                                {item.name}
                                            </a>
                                            <p className="text-muted fw-semibold mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No assessments available.</p>
                )}
            </div>
        );
    };

    const renderAssessments = () => (
        <form onSubmit={handleAssessmentsSubmit}>
            <div className="row g-3 g-xl-1 d-flex flex-wrap justify-content-center align-items-stretch">
                {assessment.map((item, index) => (
                    <div className="col-2" key={`jobassessment-${item.id || index}`}>
                        <div className="card card-custom card-flush">
                            <div className="card-header d-flex justify-content-between align-items-center p-3">
                                <h3 className="card-title">
                                    <span className="card-label fw-bold text-gray-600 text-capitalize">
                                        {item.name || `Assessment ${index + 1}`}
                                    </span>
                                </h3>
                                {item.assessmentId && (
                                    <button
                                        className="btn btn-link btn-color-danger"
                                        onClick={() => handleRemoveAssessment(item.assessmentId)}
                                        type="button"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="separator separator-dotted border-gray my-10"></div>
            {renderAvailableAssessments()}
            <div className="text-end mt-4">
                <button type="submit" className="btn btn-dark w-100 w-md-auto">
                    Save & Continue
                </button>
            </div>
        </form>
    );

    const renderWorkflowSteps = () => (
        <form onSubmit={handleWorkflowSubmit}>
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
                {Object.values(workflowSteps).map((step) => (
                    <WorkflowStep
                        key={step.id}
                        step={step}
                        onChange={() => handleWorkflowCheckboxChange(step.id)}
                    />
                ))}
            </div>
            <div className="text-end mt-4">
                <button type="submit" className="btn btn-dark w-100 w-md-auto">
                    Save & Continue
                </button>
            </div>
        </form>
    );

    return (
        <div className="current py-5">
            {hasApplicationProcess || isFormSaved ? renderAssessments() : renderWorkflowSteps()}
        </div>
    );
};

const WorkflowStep = memo(({ step, onChange }) => {
    const { id, processName, checked } = step;
    const icons = {
        1: 'fa-gear',
        2: 'fa-users-medical',
        3: 'fa-user-shield',
        4: 'fa-phone-plus',
        5: 'fa-bars-progress',
        6: 'fa-comments-question',
        7: 'fa-envelope-open-text',
        8: 'fa-star',
        9: 'fa-award',
        10: 'fa-user-check',
    };
     const disabledSteps = [1, 2, 9, 10];
     const isDisabled = disabledSteps.includes(id);
    return (
        <div
            className="d-flex flex-column align-items-center text-center border p-4 rounded shadow-sm"
            style={{
                maxWidth: '200px',
                maxHeight: '200px',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                textAlign: 'center',
            }}
        >
            <label className="form-check-image w-100">
                <div className="form-check-wrapper d-flex flex-column align-items-center mb-0">
                    <i className={`fa-light ${icons[id] || 'fa-box'} fs-2x`}></i>
                    <div className="form-check form-check-custom form-check-solid d-flex align-items-center mt-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={checked}
                            onChange={onChange}
                            disabled={isDisabled} 
                        />
                        <span className="form-check-label text-uppercase">{processName}</span>
                    </div>
                </div>
            </label>
        </div>
    );
});


export { JobWorkflowComponent };

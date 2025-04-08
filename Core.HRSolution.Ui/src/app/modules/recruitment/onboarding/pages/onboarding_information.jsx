import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { enableLoadingRequest, disableLoadingRequest } from '../../../../helpers/loading_request';
import { getOnboardingFormInfo } from '../core/requests/_request';
import { Step1Div } from '../components/setup-steps/Step1';
import { Step2Div } from '../components/setup-steps/Step2';
import { Step3Div } from '../components/setup-steps/Step3';
import { Step4Div } from '../components/setup-steps/Step4';
import { Step5Div } from '../components/setup-steps/Step5';
import { FileUploadStep } from '../components/setup-steps/FileUploadStep';
import { KTIcon } from '@/_metronic/helpers';

const stepsConfig = [
  { label: 'Core Information Sheet', key: 'Step 1' },
  { label: 'Requirements', key: 'Step 2' },
  { label: 'Company ID', key: 'Step 3' },
  { label: 'WFH Application', key: 'Step 4' },
  { label: 'Acknowledgment', key: 'Step 5' },
];

const OnboardingInformation = () => {
  const { id } = useParams();
  const [candidateId, setCandidateId] = useState(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    setStep(prev => prev - 1);
    if (candidateId) {
      getOnboardingInfos();
    }
  };

  useEffect(() => {
    if (id) setCandidateId(id);
  }, [id]);

  const fetchOnboardingInfos = async () => {
    if (!candidateId) return;
    enableLoadingRequest();
    setLoading(true);

    try {
      const res = await getOnboardingFormInfo(candidateId);
      if (res.status === 200 && res.data) {
        setData(res.data);
        setStep(res.data.onboardingInfo?.currentStep || 1);
      }
    } catch (error) {
      console.error('Error fetching onboarding form infos:', error);
    } finally {
      disableLoadingRequest();
      setLoading(false);
    }
  };

  const getOnboardingInfos = async () => {
    if (!candidateId) return;
    enableLoadingRequest();
    setLoading(true);

    try {
      const res = await getOnboardingFormInfo(candidateId);
      if (res.status === 200 && res.data) {
        setData(res.data);
        // setStep(res.data.onboardingInfo?.currentStep || 1);
      }
    } catch (error) {
      console.error('Error fetching onboarding form infos:', error);
    } finally {
      disableLoadingRequest();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidateId) fetchOnboardingInfos();
  }, [candidateId]);

  const renderStepContent = () => {
    const commonProps = { handleNext, handleBack, id: candidateId };
    const docs = data?.onboardingDocuments;
    const info = data?.onboardingInfo;
    const wfh = data?.wfhInformations;

    switch (step) {
      case 1:
        return <Step1Div {...commonProps} onboardingInfoSheet={info} />;
      case 2:
        return <Step2Div {...commonProps} onboardingDocuments={docs} />;
      case 3:
        return <Step3Div {...commonProps} onboardingDocuments={docs} />;
      case 4:
        return <Step4Div {...commonProps} onboardingDocuments={docs} wfhInformations={wfh} />;
      case 5:
        return <Step5Div handleBack={handleBack} id={candidateId} />;
      default:
        return null;
    }
  };

  const renderStepHeader = (index, label) => {
    const currentStep = index + 1;
    const isCompleted = step > currentStep;
    const isActive = step === currentStep;

    return (
      <div className="p-2 flex-fill bd-highlight" key={currentStep}>
        <div className="d-flex bd-highlight gap-2">
          <div
            className={`rounded d-flex align-items-center justify-content-center ${
              isCompleted
                ? 'bg-light-danger'
                : isActive
                ? 'bg-dark text-white'
                : 'bg-none text-dark'
            }`}
            style={{ width: '40px', height: '40px' }}
          >
            {isCompleted ? (
              <KTIcon iconName="check" className="fs-1 text-danger" />
            ) : (
              <span className="fs-4 fw-bolder">{currentStep}</span>
            )}
          </div>

          <div className={`bd-highlight ${isCompleted ? 'fw-bold text-muted' : ''}`}>
            <div className="fs-5">{label}</div>
            <div className="fs-8">{`Step ${currentStep}`}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading || !data) {
    return (
      <div id="kt_app_content_container" className="app-container container-xxl">
        <div className="card">
          <div className="card-body">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="kt_app_content_container"
      className="app-container container-xxl d-flex justify-content-center align-items-center"
    >
      <div className="card w-100">
        <h3 className="m-3">Onboarding Information Form</h3>

        {!data.onboardingInfo?.isAcknowledged && (
          <div className="d-flex bd-highlight card-header gap-5 justify-content-center py-2">
            {stepsConfig.map((stepItem, index) => renderStepHeader(index, stepItem.label))}
          </div>
        )}

        <div className="card-body py-10">
          {data.onboardingInfo?.isAcknowledged ? (
            <FileUploadStep id={candidateId} onboardingDocuments={data.onboardingDocuments} />
          ) : (
            renderStepContent()
          )}
        </div>
      </div>
    </div>
  );
};

export { OnboardingInformation };

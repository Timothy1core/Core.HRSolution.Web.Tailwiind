import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Content } from '../../../../../_metronic/layout/components/content';
import { getOnboardingInfo } from '../core/requests/_request';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../helpers/loading_request';
import { KTIcon } from '../../../../../_metronic/helpers';
import { ProfileRow } from '../components/profile/profile_row';
import { VerticalNavBar } from '../components/navs/vertical_navbar';
import Swal from 'sweetalert2';
import { MoveToStageWrapper } from '../components/drawers/MoveToStageDrawer';
import { AddTemporaryBioIdModal } from '../components/modals/AddTemporaryBioIdModal';
// import { saveApproveSignature } from '../core/requests/_request'; // make sure this function exists

const ViewOnboardingInfoPage = () => {
  const location = useLocation();
  const [candidateId, setCandidateId] = useState('');
  const [coreInfoData, setCoreInfoData] = useState({});
  const [wfhInfoData, setWfhInfoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoveToStageDrawer, setshowMoveToStageDrawer] = useState(false);
  const [showAddTemporaryIdModal, setshowAddTemporaryIdModal] = useState(false);
  
  const [applicationProcesses, setApplicationProcesses] = useState([]);
  const [acceptedDate, setAcceptedDate]= useState('');
  const handleShowMoveToStageDrawer = () => setshowMoveToStageDrawer(true);
  const handleCloseMoveToStageDrawer = () => setshowMoveToStageDrawer(false);
  const handleCloseDrawerWithRefresh = () => {
    fetchOnboardingInfo();
    handleCloseMoveToStageDrawer();
  };
  const handleShowAddTempId = () => setshowAddTemporaryIdModal(true);
  const handleCloseAddTempId = () => setshowAddTemporaryIdModal(false);
  const handleCloseModalWithRefresh = () => {
    fetchOnboardingInfo();
    handleCloseAddTempId();
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) setCandidateId(id);
  }, [location.search]);

  useEffect(() => {
    if (candidateId) {
      fetchOnboardingInfo();
    }
  }, [candidateId]);

  const fetchOnboardingInfo = async () => {
    enableLoadingRequest();
    setLoading(true);
    try {
      const res = await getOnboardingInfo(candidateId);
      if (res.status === 200 && res.data) {
        setCoreInfoData(res.data.onboardingInfo);
        setWfhInfoData(res.data.wfhInfo);
        setApplicationProcesses(res.data.statusList)
        setAcceptedDate(res.data.jobOfferInfo.acceptedDate)
      }
    } catch (error) {
      console.error('Error fetching onboarding info:', error);
    } finally {
      disableLoadingRequest();
      setLoading(false);
    }
  };

  const handleSaveSignature = async (dataURL) => {
    try {
      const response = await saveApproveSignature(candidateId, dataURL);

      Swal.fire({
        title: 'Success!',
        text: response.data.responseText,
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        alert('Signature saved successfully!');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'An error occurred while saving the signature.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <>
      {!loading && (
        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
          <div
            id="kt_app_toolbar_container"
            className="app-container container-fluid d-flex flex-stack"
          >
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <a href="onboarding" className="btn btn-sm btn-light-danger">
                <KTIcon iconName="entrance-right" className="fs-2" />
                Go Back
              </a>
            </div>
          </div>
        </div>
      )}

      {!loading && candidateId && (
        <Content>
          <ProfileRow
            candidateId={candidateId}
            candidateName={coreInfoData.candidateName}
            status={coreInfoData.onboardingStatusName}
            handleShow={handleShowMoveToStageDrawer}
          />
          <VerticalNavBar
            coreInfoSheet={coreInfoData}
            candidateId={candidateId}
            wfhInformation={wfhInfoData}
            acceptedDate={acceptedDate}
            refresh={fetchOnboardingInfo}
          />
        </Content>
      )}

      <MoveToStageWrapper startDate={coreInfoData.startDate} orientationDate={coreInfoData.orientationDate} applicationProcessesData={applicationProcesses} currentStage={coreInfoData.onboardingStatusId} candidateId={candidateId} handleShow={showMoveToStageDrawer} handleClose={handleCloseMoveToStageDrawer} handleCloseWithRefresh={handleCloseDrawerWithRefresh} handleShowAddTempId={handleShowAddTempId} temporaryId={coreInfoData.temporaryEmployeeId}/>
      <AddTemporaryBioIdModal id={candidateId} showModal={showAddTemporaryIdModal} handleClose={handleCloseAddTempId} handleCloseWithRefresh={handleCloseModalWithRefresh}/>
    </>
  );
};

const ViewOnboardingInfo = () => <ViewOnboardingInfoPage />;

export { ViewOnboardingInfo };

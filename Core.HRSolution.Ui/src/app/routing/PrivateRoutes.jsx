import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MasterLayout } from '../../_metronic/layout/MasterLayout';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DashboardWrapper } from '../modules/landing-page/user_dashboard';
// import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils';
import { PermissionManagementWrapper, MenuManagementWrapper, RoleManagementWrapper, SectionMenuManagementWrapper, ApiManagementWrapper } from '../modules/system.setup';
import { getUserMenuRoutes } from '../modules/auth/core/requests/_requests';

//#region recruitment private routes
import { 
  ClientDashboardWrapper,
  ClientProfileWrapper,
  ClientCreateJobProfileWrapper,
  ClientEditJobProfileWrapper,
  CreateAssessment,
  EditAssessment,
  AssessmentManagementWrapper,
  CreateTalentAcquisitionWrapper,
  UpdateTalentAcquisitionWrapper,
  DashboardTalentAcquisitionWrapper,
  EmailTemplateWrapper,
  EmailAutomationWrapper,
 CandidatesWrapper,
 ViewCandidate
} from '../modules/recruitment/Routes';
import { DocumentWriteUp } from '../modules/recruitment/candidates/pages/DocumentWriteUp';
import { PipelineWrapper } from '../modules/recruitment/pipeline/pages/PipelineWrapper';
import { JobOfferWrapper } from '../modules/recruitment/job.offer/pages/JobOfferWrapper';
import { JobOfferCreate } from '../modules/recruitment/job.offer/pages/JobOfferCreate';
import { ViewJobOffer } from '../modules/recruitment/job.offer/pages/ViewJobInfo';
import { OnboardingWrapper } from '../modules/recruitment/onboarding/pages/OnboardingWrapper';
import { ViewOnboardingInfo } from '../modules/recruitment/onboarding/pages/ViewOnboardingInfo';
import { PreviewJobOfferInfo } from '../modules/recruitment/job.offer/pages/PreviewJobOfferInfo';
import { Demo1Layout } from '../../_metronic/layouts/demo1';
//#endregion



// Component mapping based on the menuPath
const componentMap = {
  //#region MAIN
  '/dashboard': <DashboardWrapper />,
  //#endregion

  //#region SYSTEM SETUP
  '/system/rolemanagement': <RoleManagementWrapper />,
  '/system/menumanagement': <MenuManagementWrapper />,
  '/system/permissionmanagement': <PermissionManagementWrapper />,
  '/system/sectionmenumanagement': <SectionMenuManagementWrapper />,
  '/system/apimanagement': <ApiManagementWrapper />,
  //#endregion

  //#region RECRUITMENT
  '/recruitment/clientdashboard': <ClientDashboardWrapper />,
  '/recruitment/clientprofile/:id': <ClientProfileWrapper />,
  '/recruitment/createjobprofile': <ClientCreateJobProfileWrapper />,
  '/recruitment/editjobprofile/:id': <ClientEditJobProfileWrapper />,
  
  
  '/recruitment/assessmentmanagement' : <AssessmentManagementWrapper />,
  '/recruitment/createassessment' : <CreateAssessment />,
  '/recruitment/editassessment' : <EditAssessment />,


  '/recruitment/createtalentacquisition' : <CreateTalentAcquisitionWrapper />,
  '/recruitment/talentacquisitions' : <DashboardTalentAcquisitionWrapper />,
  '/recruitment/talentacquisitioninfo/:id' : <UpdateTalentAcquisitionWrapper />,



  '/recruitment/emailtemplate' : <EmailTemplateWrapper />,
  '/recruitment/emailautomation' : <EmailAutomationWrapper />,

  '/recruitment/candidates' : <CandidatesWrapper />,
  '/recruitment/viewcandidate' : <ViewCandidate />,

  '/recruitment/documentwriteup' : <DocumentWriteUp />,

  '/recruitment/pipeline' : <PipelineWrapper />,
  
  '/recruitment/joboffer' : <JobOfferWrapper />,
  '/recruitment/editjoboffer/:id': <JobOfferCreate />,
  '/recruitment/viewjoboffer': <ViewJobOffer />,
  '/recruitment/previewjoboffer': <PreviewJobOfferInfo />,

  '/recruitment/onboarding' : <OnboardingWrapper />,
  '/recruitment/viewOnboarding' : <ViewOnboardingInfo />
  //#endregion
}; 

const PrivateRoutes = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserMenuRoutes()
      .then(response => {
        setMenuData(response.data.routes);  // Adjust to match the new JSON structure
      })
      .catch(err => {
        console.log('Error fetching menu data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <TopBarProgress />;
  }

  return (
    <Routes>
      <Route element={<Demo1Layout />}>
      {/* Static Routes */}
      <Route path="auth/*" element={<Navigate to="/dashboard" />} />

        {/* Dynamic Routes based on menuData */}
        {menuData.map((path, index) => (
          <Route
            key={index}
            path={path}
            element={componentMap[path] || <Navigate to="/error/404" />}
          />
        ))}

        {/* 404 Redirect for unmatched routes */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

// Suspense wrapper
// const SuspensedView = ({ children }) => {
//   const baseColor = getCSSVariableValue('--bs-primary');
//   TopBarProgress.config({
//     barColors: {
//       '0': baseColor,
//     },
//     barThickness: 1,
//     shadowBlur: 5,
//   });
//   return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
// };

export { PrivateRoutes };

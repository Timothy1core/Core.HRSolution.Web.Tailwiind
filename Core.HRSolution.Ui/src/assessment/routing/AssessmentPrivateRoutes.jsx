import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DashboardWrapper } from '../modules/landing-page/candidateDashboard';
// import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils';



// Component mapping based on the menuPath
const componentMap = {
  //#region MAIN
  '/dashboard': <DashboardWrapper />,
  //#endregion

};

const AssessmentPrivateRoutes = () => {

  return (
    <Routes>
        <Route path="assessment-auth/*" element={<Navigate to="/dashboard" />} />
        <Route path='/dashboard' element={<DashboardWrapper/>} />
        <Route path="*" element={<Navigate to="/error/404" />} />
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

export { AssessmentPrivateRoutes };

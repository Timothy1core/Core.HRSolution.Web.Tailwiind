import { Navigate, Route, Routes } from 'react-router'
import { useAuth } from '@/app/modules/auth'
import { AuthPage } from '../modules/auth'
// import { RequireAuth } from '@/app/auth/RequireAuth'
import { Demo7Layout } from '@/_metronic/layouts/demo7'
import { ErrorsRouting } from '@/app/errors'
import { PrivateRoutes } from './PrivateRoutes'
// Routes from Metronic Dashboard (unchanged)
import { DefaultPage, Demo1DarkSidebarPage } from '@/_metronic/pages/dashboards'
// ... (import all other internal page components as-is)

// External public routes
import {
  ApplyPublicRoutes,
  CarrersPageRoutes,
  TafPublicRoutes,
  CandidateAssessmentPublicRoutes,
  JobOfferAcceptancePublicRoutes,
  OnboardingRequirementsPublicRoutes,
  JobOfferApprovalPublicRoutes
} from '@/app/routing/PublicRoutes'

// Candidate assessment-specific
import { AssessmentAuthPage } from '@/assessment/modules/auth'
import { AssessmentPrivateRoutes } from '@/assessment/routing/AssessmentPrivateRoutes'
import { AssessmentLogout } from '@/assessment/modules/auth/Logout'

// Logout
import { Logout } from '@/app/modules/auth'

const AppRoutingSetup = () => {
  const { currentUser } = useAuth()

  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/assessmentlogout" element={<AssessmentLogout />} />
      <Route path="/careers" element={<CarrersPageRoutes />} />
      <Route path="/jobs/*" element={<ApplyPublicRoutes />} />
      <Route path="/client/*" element={<TafPublicRoutes />} />
      <Route path="/candidate/*" element={<CandidateAssessmentPublicRoutes />} />
      <Route path="/joboffer/*" element={<JobOfferAcceptancePublicRoutes />} />
      <Route path="/salarypackage/*" element={<JobOfferApprovalPublicRoutes />} />
      <Route path="/onboarding/*" element={<OnboardingRequirementsPublicRoutes />} />

      {currentUser?.loggedUser ? (
        <>
        <Route path='/*' element={<PrivateRoutes />} />
        <Route index element={<Navigate to='/dashboard' />} />
        </>
      ) : currentUser?.loggedCandidate ? (
        <>
          <Route path="/*" element={<AssessmentPrivateRoutes />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/assessment-auth/*" element={<AssessmentAuthPage />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </>
      )}

      <Route path="/error/*" element={<ErrorsRouting />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  )
}

export { AppRoutingSetup }

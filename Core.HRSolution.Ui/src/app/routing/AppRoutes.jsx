/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g. `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { useAuth } from '../modules/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { ErrorsPage } from '../helpers/errors/ErrorsPage'
import { Logout, AuthPage } from '../modules/auth'
import { App } from '../../App'
import { ApplyPublicRoutes, CarrersPageRoutes, TafPublicRoutes, CandidateAssessmentPublicRoutes, JobOfferAcceptancePublicRoutes, OnboardingRequirementsPublicRoutes, JobOfferApprovalPublicRoutes } from './PublicRoutes'

//#region for Assessment
import { AssessmentAuthPage } from '../../assessment/modules/auth'
import { AssessmentPrivateRoutes } from '../../assessment/routing/AssessmentPrivateRoutes'
import {AssessmentLogout} from '../../assessment/modules/auth/Logout'
//#endregion

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env

const AppRoutes = () => {
  const { currentUser } = useAuth()
  return (
    // <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route path="/*" element={<App />} >
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          <Route path='assessmentlogout' element={<AssessmentLogout />} />
          <Route path="careers" element={<CarrersPageRoutes />} />
          <Route path="jobs/*" element={<ApplyPublicRoutes />} />
          <Route path="client/*" element={<TafPublicRoutes />} />
          <Route path="candidate/*" element={<CandidateAssessmentPublicRoutes />} />
          <Route path="joboffer/*" element={<JobOfferAcceptancePublicRoutes />} />
          <Route path="salarypackage/*" element={<JobOfferApprovalPublicRoutes />} />
          <Route path="onboarding/*" element={<OnboardingRequirementsPublicRoutes />} />
          

          {currentUser?.loggedUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : currentUser?.loggedCandidate ? (
            <>
              <Route path='/*' element={<AssessmentPrivateRoutes />} /> {/* Assessment route */}
              <Route index element={<Navigate to='/dashboard' />} /> {/* Assessment route */}
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path="assessment-auth/*" element={<AssessmentAuthPage />} /> {/* Assessment route */}
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    // </BrowserRouter>
  )
}

export { AppRoutes }

import {Route, Routes} from 'react-router-dom'
import {PublicMasterLayout} from '../../_metronic/layout/PublicMasterLayout'

import {ApplicationForm} from '../modules/recruitment/application.form/index'
import {CareerPage} from '../modules/recruitment/application.form/careers'
import {ClientTAF} from '../modules/recruitment/talent.acquisition/pages/client_taf'
import { CandidateAssessments } from '../modules/recruitment/candidates/pages/candidate_assessments'
import { JobOfferAcceptance } from '../modules/recruitment/job.offer/pages/job_offer_acceptance'
import { OnboardingInformation } from '../modules/recruitment/onboarding/pages/onboarding_information'
import { JobOfferApproval } from '../modules/recruitment/job.offer/pages/job_offer_approval'

const ApplyPublicRoutes = () => (
  <Routes>
    <Route element={<PublicMasterLayout />}>
      <Route path='/apply/:id' element={<ApplicationForm />} />
    </Route>
  </Routes>
)

const CarrersPageRoutes = () => (
  <Routes>
    <Route >
      <Route path='' element={<CareerPage />} />
    </Route>
  </Routes>
)

const TafPublicRoutes = () => (
  <Routes>
    <Route element={<PublicMasterLayout />}>
      <Route path='/taf/:id' element={<ClientTAF />} /> 
    </Route>
  </Routes>
)

const CandidateAssessmentPublicRoutes = () => (
  <Routes>
    <Route element={<PublicMasterLayout />}>
      <Route path='/assessmentinfo/:id' element={<CandidateAssessments />} />
    </Route>
  </Routes>
)

const JobOfferApprovalPublicRoutes = () => (
  <Routes>
    <Route element={<PublicMasterLayout />}>
      <Route path='/approval' element={<JobOfferApproval />} />
    </Route>
  </Routes>
)


const JobOfferAcceptancePublicRoutes = () => (
  <Routes>
    <Route element={<PublicMasterLayout />}>
      <Route path='/acceptance' element={<JobOfferAcceptance />} />
    </Route>
  </Routes>
)

const OnboardingRequirementsPublicRoutes = () => (
  <Routes>
    <Route element={<PublicMasterLayout />}>
      <Route path='/onboardinginformation/:id' element={<OnboardingInformation />} />
    </Route>
  </Routes>
)
export {
  ApplyPublicRoutes,
  CarrersPageRoutes,
  TafPublicRoutes,
  CandidateAssessmentPublicRoutes,
  JobOfferApprovalPublicRoutes,
  JobOfferAcceptancePublicRoutes,
  OnboardingRequirementsPublicRoutes
}

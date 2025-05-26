
import { PageTitle } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import {useAuth} from '../auth'


const DashboardPage = () => {
  const {currentUser} = useAuth()
  return(
  <>
    <ToolbarWrapper title="GET STARTED" subtitle={`Hi ${currentUser?.loggedUser ? currentUser?.loggedUser.firstName.toUpperCase() : currentUser.loggedCandidate.firstName}`}  />
    {/* <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
      <div id="kt_app_toolbar_container" className="app-container container-fluid d-flex flex-stack">
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
          <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0 text-uppercase">Get Started</h1>
          <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
            <li className="breadcrumb-item text-muted text-uppercase">
            Hi {currentUser?.loggedUser.fullName}
            </li>
          </ul>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <div className="me-5">
            <h6 className="fs-9 text-uppercase text-muted">Current IP Address</h6>
            <h4 className="fs-5 text-danger">@Model.PublicIp</h4>
          </div>
        </div>
      </div>
    </div> */}
    <Content>
    </Content>
  </>
  )
  
}

const DashboardWrapper = () => {
  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle> */}
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }

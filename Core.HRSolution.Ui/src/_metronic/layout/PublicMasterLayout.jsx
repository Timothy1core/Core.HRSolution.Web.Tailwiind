import {useEffect} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {ScrollTop} from './components/scroll-top'
import {PageDataProvider} from './core'
import {reInitMenu} from '../helpers'

const PublicMasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  return (
    <PageDataProvider>
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
            <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                <div id="kt_app_header" className="app-header h-100px" data-kt-sticky="true" data-kt-sticky-activate="{default: true, lg: true}" data-kt-sticky-name="app-header-minimize" data-kt-sticky-offset="{default: '200px', lg: '0'}" data-kt-sticky-animation="false" style={{ backgroundColor: '#000000' }}
                >
                    <div className="app-container container-xxl d-flex align-items-stretch  justify-content-center" id="kt_app_header_container">
                        <div className="d-flex align-items-center">
                            <a href="index.html">
                                <img alt="Logo" src="https://cdn.onecoredevit.com/logos/core-logo-white-text.png" className="h-30px h-lg-50px app-sidebar-logo-default" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
                    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                        <div className="d-flex flex-column flex-column-fluid">
                            <div id="kt_app_content" className="app-content flex-column-fluid">
                            <Outlet />
                                
                            </div>
                        </div>

                        <div id="kt_app_footer" className="app-footer">
                            <div className="app-container container-xxl d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                                <div className="text-gray-900 order-2 order-md-1">
                                    <span className="text-muted fw-semibold me-1">{new Date().getFullYear().toString()} &copy;</span>
                                    <a href="https://onecoredevit.com/" target="_blank" className="text-gray-800 text-hover-danger">One CoreDev IT (CORE)</a>
                                </div>
                                <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                                    <li className="menu-item">
                                        <a href="https://www.facebook.com/onecoredevit" className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"><i className="fab fa-facebook-f fs-4"></i></a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="#" className="btn btn-sm btn-icon  btn-light-dark me-2 bg-white"><i className="fa-brands fa-linkedin-in fs-4"></i></a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="#" className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"><i className="fa-brands fa-tiktok fs-4"></i></a>
                                    </li>
                                    <li className="menu-item">
                                        <a href="#" className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"><i className="fa-brands fa-x-twitter fs-4"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      {/* begin: = Drawers */}
      {/* <ActivityDrawer /> */}
      {/* <RightToolbar /> */}
      {/* <DrawerMessenger /> */}
      {/* end: = Drawers */}

      {/* begin: = Modals */}

      {/* <UpgradePlan /> */}
      {/* end: = Modals */}
      <ScrollTop />
    </PageDataProvider>
  )
}

export {PublicMasterLayout}

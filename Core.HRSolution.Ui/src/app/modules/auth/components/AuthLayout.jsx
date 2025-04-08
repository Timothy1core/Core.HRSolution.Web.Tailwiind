
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import { toAbsoluteUrl } from '@/_metronic/utils';

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
      {/* begin::Body */}
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        {/* end::Form */}

        {/* begin::Footer */}
        <div className='d-flex flex-center flex-wrap px-5'>
          {/* begin::Links */}
          <div className='d-flex fw-semibold text-primary fs-base'>
            <a href='https://onecoredevit.com/privacy-policy/' className='px-5 link-danger' target='_blank'>
              Privacy Policy
            </a>

            <a href='mailto:jomari.mananghaya@onecoredevit.com' className='px-5 link-danger' target='_blank'>
              Contact Us
            </a>
          </div>
          {/* end::Links */}
        </div>
        {/* end::Footer */}
      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
        className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
        style={{backgroundImage: `url(${toAbsoluteUrl('media/auth/bg10.jpeg')})`}}
      >
        {/* begin::Content */}
        <div className='d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100'>
          {/* begin::Logo */}
          <Link to='/' className='mb-5'>
            <img alt='Logo' src={toAbsoluteUrl('core_logos/core-icon.png')} className='h-50px h-lg-70px' />
          </Link>
          {/* end::Logo */}

          {/* begin::Image */}
          {/* <img
            className='mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20'
            src={toAbsoluteUrl('media/misc/auth-screens.png')}
            alt=''
          /> */}
          {/* end::Image */}

          {/* begin::Title */}
          <h1 className='text-gray-700 fs-2qx fw-bolder text-center mb-lg-7'>
            CORE HR SOLUTION
          </h1>
          {/* end::Title */}

          {/* begin::Text */}
          <div className='d-none d-lg-block w-75 text-gray-600 fs-base text-center mb-14'>
            All-in-one {' '}
            <span className='opacity-75-hover text-danger fw-bold'>HR and Payroll</span> {' '}
            platform designed to streamline employee management, time tracking, and payroll processes. 
            Tailored for modern businesses, it adapts to dynamic operational needs,
            offering robust customization for efficient workforce management and seamless integration with <span className='opacity-75-hover text-danger fw-bold'>agile workflows</span>.
          </div>
          {/* end::Text */}

          {/* begin:: copyright */}
          <div className='d-none d-lg-block align-text-bottom text-gray-600 fs-7 text-center'>
            Copyright © 2024. All rights reserved. ONE COREDEV IT INC. (CORE)
          </div>
          {/* end:: copyright */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::Aside */}
    </div>
  )
}

export {AuthLayout}

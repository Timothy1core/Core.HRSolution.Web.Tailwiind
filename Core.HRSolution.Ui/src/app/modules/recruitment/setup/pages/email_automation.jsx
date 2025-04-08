import React, { useState, useEffect } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import { CreateEmailAutomationModal } from '../components/modals/create_email_automation';
import { DataEmailAutomationDashboardComponent } from '../components/elements/email_automation_dashboard';


const EmailAutomationPage = () => {

  return (
    <>
      <ToolbarWrapper
        title="Email Template"
        subtitle="System Setup - Settings"
      />
      
      <Content>
        <div className="card mb-5">
          <div className="card-body">
            <div className="d-flex flex-wrap flex-stack mb-6">
              <div className="d-flex align-items-center position-relative me-4">
                <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-3" />
                <input
                  type="text"
                  className="form-control form-control-white form-control-sm w-250px ps-9"
                  placeholder="Search"
                />
              </div>
              <div className="d-flex flex-wrap my-2">
              </div>
            </div>


            <div className="d-flex align-items-center mb-6">
                <span data-kt-element="bullet" className="bullet bullet-vertical d-flex align-items-center min-h-20px mh-50 me-4 bg-info"></span>
                <div className="flex-grow-1 me-5">
                    <div className="text-gray-800 fw-semibold fs-4 text-uppercase">
                        Automation Template
                    </div>
                </div>
            </div>
            <div className="row d-flex g-3 g-xl-6">
              <div className='col-md-3'>
                <CreateEmailAutomationModal type={"1"}/>
              </div>
              <div className='col-md-3'>
                <CreateEmailAutomationModal type={"2"}/>
              </div>
              <div className='col-md-3'>
                <CreateEmailAutomationModal type={"3"}/>
              </div>
              <div className='col-md-3'>
                <CreateEmailAutomationModal type={"4"}/>
              </div>
              <div className='col-md-3'>
                <CreateEmailAutomationModal type={"5"}/>
              </div>
            </div>

            <div className="separator separator-dashed border-secondary my-10"></div>

            <div className="d-flex align-items-center mb-6">
                <span data-kt-element="bullet" className="bullet bullet-vertical d-flex align-items-center min-h-20px mh-50 me-4 bg-info"></span>
                <div className="flex-grow-1 me-5">
                    <div className="text-gray-800 fw-semibold fs-4 text-uppercase">
                      Automation Dashboard
                    </div>
                </div>
            </div>

            <DataEmailAutomationDashboardComponent></DataEmailAutomationDashboardComponent>
          </div>
        </div>
      </Content>
    </>
  );
};

const EmailAutomationWrapper = () => <EmailAutomationPage />;

export { EmailAutomationWrapper };

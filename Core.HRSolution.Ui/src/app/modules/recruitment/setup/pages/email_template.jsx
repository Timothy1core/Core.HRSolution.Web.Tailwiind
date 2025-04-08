import React, { useState, useEffect } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import Swal from 'sweetalert2';
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import { CreateEmailTemplateModal } from '../components/modals/create_email_content';
import { DataEmailDashboardComponent } from '../components/elements/email_dashboard';


const EmailTemplatePage = () => {

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
                <CreateEmailTemplateModal></CreateEmailTemplateModal>
              </div>

            </div>
            <DataEmailDashboardComponent></DataEmailDashboardComponent>

          </div>
        </div>
      </Content>
    </>
  );
};

const EmailTemplateWrapper = () => <EmailTemplatePage />;

export { EmailTemplateWrapper };

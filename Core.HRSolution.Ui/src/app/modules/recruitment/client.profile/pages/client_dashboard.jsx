import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import React, { useState, useCallback } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { MyModal } from "../component/modals/create_client";
import { DataClientDashboardComponent } from "../component/elements/client_dashboard_component";
import {
  SelectCoreServiceComponent,
  SelectClientStatusComponent,
  SelectClientCompanyGroupComponent
} from '../component/dropdowns/client_profile_dropdown_component';


import  ActionComponent  from "../../../../helpers/action_component";

const DashboardPage = () => {
  const [groupId, setGroupId] = useState(null);
  const [serviceId, setServiceId] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [refresh, setRefresh] = useState(false); // Track refresh
  const [searchValue, setSearchValue] = useState('');

  const handleGroupChange = (event) => {
    setGroupId(event.target.value); // Update state with selected serviceId
  };

  const handleServiceChange = (event) => {
    setServiceId(event.target.value); // Update state with selected serviceId
  };

  const handleStatusChange = (event) => {
    setStatusId(event.target.value); // Update state with selected statusId
  };

  const refreshData = useCallback(() => {
    setRefresh((prev) => !prev); // Toggle refresh to re-render component
  }, []);

  return (
    <>
      <ToolbarWrapper
        title="Client Dashboard"
        subtitle="Recruitment - Client and Job Library"
      />
      <Content>
        <div className="card card-custom">
          <div className="card-body">
            <div className="d-flex flex-wrap flex-stack mb-6">
              <div className="d-flex align-items-center position-relative me-4">
                <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-3" />
                <input
                  type="text"
                  className="form-control form-control-white form-control-sm w-250px ps-9"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="d-flex flex-wrap my-2">
              <div className="me-4">
                  <SelectClientCompanyGroupComponent
                    className="form-select form-select-white form-select-sm"
                    onChange={handleGroupChange}
                  />
                </div>
                <div className="me-4">
                  <SelectCoreServiceComponent
                    className="form-select form-select-white form-select-sm"
                    onChange={handleServiceChange}
                  />
                </div>
                <div className="me-4">
                  <SelectClientStatusComponent
                    className="form-select form-select-white form-select-sm"
                    onChange={handleStatusChange}
                  />
                </div>
                
                <ActionComponent
                  buttonPermission={'client.company.create'}
                  actionButton={<MyModal onSubmitSuccess={refreshData} />}
                />
                
                
              </div>
            </div>
            <DataClientDashboardComponent
              searchValue={searchValue}
              groupId={groupId}
              serviceId={serviceId}
              statusId={statusId}
              refresh={refresh}
            />
          </div>
        </div>
      </Content>
    </>
  );
};

const ClientDashboardWrapper = () => <DashboardPage />;

export { ClientDashboardWrapper };

import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { KTIcon } from '@/_metronic/helpers';
import { SelectCompanyProfileInformation,ApiGateWayUrl } from '../core/request/clients_request';
import { ClientUpdateModal } from '../component/modals/update_client';
import { ClientIndividualCardList } from '../component/elements/client_individual_component';
import { ClientJobProfileCardList } from '../component/elements/client_job_profile_component';



const ClientProfilePage = () => {
    const { id } = useParams(); // Retrieve clientId from URL
    const [data, setData] = useState(null);
    const [refreshData, setRefreshData] = useState(false); // State to trigger refresh

    const navigate = useNavigate();

    const fetchData = useCallback(() => {   
        SelectCompanyProfileInformation(id)
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            navigate(`/error/${error.status}`);
        });
    }, [id]);

    useEffect(() => {
      fetchData();
  }, [fetchData, refreshData]);

  const handleRefresh = () => {
    setRefreshData((prev) => !prev); // Toggle refreshData to trigger useEffect
  };

    if (!data) {
        return <p>Loading client data...</p>;
    }
    return (
        <>
        <ToolbarWrapper title="Client Profile" subtitle="Recruitment - Client and Job Library" />
        <Content>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-body pt-9 pb-0'>
                    <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
                        <div className='me-7'>
                            <div className='symbol symbol-fixed position-relative bg-secondary p-8'>
                                <img src={`${ApiGateWayUrl()}/recruitment/client/client_logo/${id}`} className='w-100' alt='Client Logo' />
                            </div>
                        </div>

                        <div className='flex-grow-1'>
                            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                                <div className='d-flex flex-column my-4'>
                                    <div className='d-flex align-items-center mb-1'>
                                        <h1 className='text-gray-800 fs-1 fw-bolder me-1'>
                                            {data.profile.name}
                                            <KTIcon iconName='verify' className='fs-1 text-danger' />
                                        </h1>
                                    </div>
                                    <div className='d-flex flex-wrap fw-bold fs-6 pe-2'>
                                        <h6 className='d-flex align-items-center text-gray-500 me-5 mb-2'>
                                            <KTIcon iconName='category' className='fs-4 me-1' />
                                            {data.profile.industry}
                                        </h6>
                                        <h6 className='d-flex align-items-center text-gray-500 me-5 mb-2'>
                                            <KTIcon iconName='time' className='fs-4 me-1' />
                                            {data.profile.timezone}
                                        </h6>
                                        <h6 className='d-flex align-items-center text-gray-500 me-5 mb-2'>
                                            <KTIcon iconName='chrome' className='fs-4 me-1' />
                                            {data.profile.website}
                                        </h6>
                                    </div>
                                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                                        <span className="badge badge-light-info me-1">{data.profile.coreService}</span>
                                        <span className="badge badge-light-primary">{data.profile.clientStatus}</span>
                                    </div>
                                </div>
                                
                                <div className='d-flex'>
                                    <div className='me-0'>
                                        <button
                                            className='btn btn-sm btn-icon btn-bg-light btn-active-color-danger'
                                            data-kt-menu-trigger='click'
                                            data-kt-menu-placement='bottom-end'
                                            data-kt-menu-flip='top-end'
                                        >
                                            <i className='bi bi-three-dots fs-3'></i>
                                        </button>
                                        <div className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-auto min-w-200 mw-300px' data-kt-menu='true'>
                                            <div className="menu-item px-3">
                                                <div className="menu-content fs-6 text-gray-900 fw-bold px-3 py-4">Quick Actions</div>
                                            </div>
                                            <div className='separator border-gray-200'></div>
                                            <div className="menu-item px-3">
                                                <ClientUpdateModal 
                                                clientInfoData={data.profile} 
                                                onUpdate={handleRefresh}
                                                >
                                                </ClientUpdateModal>
                                            </div>
                                            <div className="menu-item px-3">
                                                <Link to="/recruitment/clientdashboard" className="menu-link px-3">
                                                    Back to Client Dashboard
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex overflow-auto h-55px'>
                        <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
                            <li className="nav-item">
                                <a className="nav-link active" data-bs-toggle="tab" href="#tab_client_job_profiles">
                                    Job Profiles
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-bs-toggle="tab" href="#tab_client_individuals">
                                    Client Individuals
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="tab_client_job_profiles" role="tabpanel">
                    <ClientJobProfileCardList 
                    companyId={data.profile.id}
                    ></ClientJobProfileCardList >
                </div>
                <div className="tab-pane fade" id="tab_client_individuals" role="tabpanel">
                    <ClientIndividualCardList 
                    companyId={data.profile.id}
                    ></ClientIndividualCardList >
                </div>
            </div>
        </Content>
        </>
    );
};

const ClientProfileWrapper = () => <ClientProfilePage />;

export { ClientProfileWrapper };

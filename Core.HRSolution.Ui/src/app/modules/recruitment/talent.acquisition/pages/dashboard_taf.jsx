import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import { KTIcon } from '@/_metronic/helpers';
import {
  SelectClientComponent,
  SelectClientCompanyGroupComponent,
} from '../../client.profile/component/dropdowns/client_profile_dropdown_component';
import {
  SelectReasonComponent,
  SelectStatusComponent,
} from '../components/dropdown/taf_dropdown_component';
import {format} from 'date-fns';

import { SelectDashboardTaf } from '../request/taf_request';
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../_metronic/layout/components/content';

import { SendTAFModal } from "../components/modal/send_taf";
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../helpers/loading_request';
import TableWithPagination from '../../../../../app/helpers/table/TableWithPagination';




const DashboardTafPage = () => {
  const [tafData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const columns = [
    { Header: 'TAF ID', accessor: 'id',className: 'text-center', sortable: true, },
    { Header: 'Requisition', accessor: 'position', sortable: true, },
    { Header: 'Headcount', accessor: 'headcount',className: 'text-center', sortable: true, },
    { Header: 'Reason', accessor: 'reason',className: 'text-center', sortable: true, },
    { Header: 'Status', accessor: 'status',className: 'text-center', sortable: true, },
    { Header: 'Target Start Date', accessor: 'createdDate',className: 'text-center', sortable: true,
      Cell: row => (
        format(new Date(row.targetStartDate), 'MMMM d, yyyy')
        )
     },
    { Header: 'Work Arrangement', accessor: 'workArrangement',className: 'text-center', sortable: true, },
    { Header: 'Action', accessor: 'actionButtons',className: 'text-center', sortable: false,
      Cell: row => (
        <Link
          to={`/recruitment/talentacquisitioninfo/${row.id}`}
          className="btn btn-icon btn-sm btn-secondary"
        >
          <KTIcon iconName='eye' className='fs-3'/>
        </Link>

        )
     },
    
  ];
  const fetchAssessments = (   
   searchValue = '',
   sortKey = '',
   sortDirection = 'asc',
   page = 0,
   size = 10) => {
    enableLoadingRequest()
    setTableLoading(true)
    SelectDashboardTaf(searchValue, columns, sortKey, sortDirection, page, size)
      .then(response => {
        setFilteredData(response.data.data); // Set initial filtered data
        setTotalRecords(response.data.recordsTotal);
      })
      .catch(err => {
        console.error("Error fetching permissions:", err);
      })
      .finally(() => {
              disableLoadingRequest()
              setTableLoading(false)
            });
  };
 
  
  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    fetchAssessments(searchTerm, key, direction, currentPage, pageSize); // Fetch roles with updated sorting
  };

  const handlePageSizeChange = (size) => {
    console.log(size);
    setPageSize(size);
    setCurrentPage(0); // Reset to first page
    fetchAssessments(searchTerm, sortConfig.key, sortConfig.direction, 0, size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAssessments(searchTerm, sortConfig.key, sortConfig.direction, page, pageSize);
  };
  useEffect(() => {
     fetchAssessments(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
   }, []);
  return (
    <>
      <ToolbarWrapper
        title="Dashboard Talent Acquisition Form"
        subtitle="Recruitment - Talent Acquisition"
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
                <SendTAFModal></SendTAFModal>
                <button
                  type='button'
                  className='btn btn-sm btn-light-primary me-3'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                >
                  <KTIcon iconName='filter' className='fs-2' />
                  Filter
                </button>
                <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
                  <div className='px-7 py-5'>
                    <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
                  </div>
                  <div className='separator border-gray-200'></div>
                  <div className='px-7 py-5' data-kt-user-table-filter='form'>
                    <div className='mb-5'>
                      <label className='form-label fs-7 fw-bold'>Group:</label>
                      <SelectClientCompanyGroupComponent className="form-select form-select-white form-select-sm" />
                    </div>
                    <div className='mb-5'>
                      <label className='form-label fs-7 fw-bold'>Client:</label>
                      <SelectClientComponent className="form-select form-select-white form-select-sm" />
                    </div>

                    <div className='mb-5'>
                      <label className='form-label fs-7 fw-bold'>Reason:</label>
                      <SelectReasonComponent className="form-select form-select-white form-select-sm" />
                    </div>
                    <div className='mb-5'>
                      <label className='form-label fs-7 fw-bold'>Reason:</label>
                      <SelectStatusComponent className="form-select form-select-white form-select-sm" />
                    </div>
                    <div className='d-flex justify-content-end'>
                      <button
                        type='button'
                        className='btn btn-light btn-sm btn-active-light-primary fw-bold me-2 px-6'
                        data-kt-menu-dismiss='true'
                        data-kt-user-table-filter='reset'
                      >
                        Reset
                      </button>
                      <button
                        type='button'
                        className='btn btn-primary btn-sm fw-bold px-6'
                        data-kt-menu-dismiss='true'
                        data-kt-user-table-filter='filter'
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-5">
              <TableWithPagination 
                data={tafData} 
                columns={columns} 
                isLoadingValue={tableLoading}
                totalRecords={totalRecords}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </div>
        </div>
      </Content>
    </>
  );
};

const DashboardTalentAcquisitionWrapper = () => <DashboardTafPage />;

export { DashboardTalentAcquisitionWrapper };

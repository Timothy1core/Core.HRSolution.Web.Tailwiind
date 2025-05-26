import React, { useState, useEffect } from 'react';
import { KTIcon } from '../../../../../../_metronic/helpers';
import { listCandidate, generateContractPdf } from '../../core/requests/_request';
import TableWithPagination from '../../../../system.setup/core/helpers/Table Layout/TableWithPagination';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import Swal from 'sweetalert2';
const OnboardingTable = ({ className }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'candidateId', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [onboardingStatusData, setStatusData] = useState([]);
  const [selectedStatus, setStatus] = useState(0);  

  const fetchCandidates = (   
    searchValue = '',
   sortKey = '',
   sortDirection = 'asc',
   page = 0,
   size = 10,
   status = 0,
  ) => {
    enableLoadingRequest()
    setTableLoading(true)
    
    listCandidate(
      searchValue, 
      columns, 
      sortKey, 
      sortDirection, 
      page, 
      size, 
      status,
      )
      .then(response => {
        setFilteredData(response.data.data);
        setTotalRecords(response.data.recordsFiltered);
        setStatusData(response.data.statusList);
      })
      .catch(err => {
        console.error("Error fetching permissions:", err);
      })
      .finally(() => {
              disableLoadingRequest()
      setTableLoading(false)

            });
  };

  const handleGeneratePdf = async (candidateId) => {
    try {
      const response = await generateContractPdf(candidateId)
      console.log(response)
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contract-${candidateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      Swal.fire('Success', 'Contract Generated Successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const columns = [
    { Header: 'Candidate Id', accessor: 'candidateId', sortable: true, },
    { Header: 'Full Name', accessor: 'candidateName', sortable: true},
    { Header: 'Position', accessor: 'position', sortable: true, },
    { Header: 'Status', accessor: 'onboardingStatusName', sortable: true, },
     
    { Header: 'Actions', accessor: 'id', className: 'text-end', Cell: row => (
      <div className='d-flex justify-content-end flex-shrink-0'>
        {/* <ActionComponent
            buttonPermission={'recruitment.retrieve.candidate.info'}
            actionButton={  */}
        {/* <a
          href={`viewonboarding?id=${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='send' className='fs-3' />
        </a> */}
        
        <a
          href={`viewonboarding?id=${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='eye' className='fs-3' />
        </a>
        <a
          onClick={() => handleGeneratePdf(row.candidateId)}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.candidateId}
        >
          <KTIcon iconName='file-down' className='fs-3' />
        </a>
        {/* <a
          href={`contractGenerate/${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='file-right' className='fs-3' />
        </a> */}
        
        {/* }/> */}
    </div>
      )
    },
  ];

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    fetchCandidates(searchTerm, key, direction, currentPage, pageSize,
     selectedStatus,);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
    fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, 0, size,
      selectedStatus,);
    };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, page, pageSize,
      selectedStatus,);
    };  

  let debounceTimeout;
   
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    debounceTimeout = setTimeout(() => {
      fetchCandidates(value , sortConfig.key, sortConfig.direction,currentPage, pageSize,
       selectedStatus,); // Fetch roles with the current search term
    }, 300); // 300ms debounce delay
  };

  const handleApplicationProcessClick = (statusId) => {
    setStatus(statusId); // Update the state for the selected process
    fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
      statusId,);
  };


       useEffect(() => {
         fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
          selectedStatus,);
       }, []);    
      
      const handleResetFilters = () => {
        setSearchTerm('');
        setStatus(0);
        fetchCandidates('', sortConfig.key, sortConfig.direction, 0, pageSize,
          0,);
      };

  return (
    <>
      <div className='d-flex flex-column flex-md-row gap-2'>
              <div className="card flex-shrink-0 w-100 w-md-25">
                <div className="card-body p-3">
                <div className="d-flex flex-column gap-1">
                  <span className='text-center'>Application Status</span>
                  <div className="separator border-2 my-2"></div>
                          {onboardingStatusData.map((process) => {
                            const isSelected = process.statusId === selectedStatus;
                          return (
                            <a
                              key={process.statusId}
                              className={`btn btn-sm ${isSelected ? 'btn-danger' : 'btn-light-danger'} btn-clear d-flex justify-content-between align-items-center`}
                              onClick={() => handleApplicationProcessClick(process.statusId)}
                            >
                              <span className={`text-${isSelected ? 'white' : 'dark'}`}>
                                {process.status}
                              </span>
                              <b>{process.candidateCount > 0 ? process.candidateCount : '0'}</b>
                               
                            </a>
                          )
                          })}
                </div> 
                </div>
                
              </div>
              <div className="card flex-grow-1">
                <div className='card-header flex-nowrap border-0 pt-5'>
                  <div></div>
                    <div className='card-title'>
                      <input
                        type='text'
                        className='form-control form-control-sm me-2'
                        placeholder='Search'
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <a
                         href="#"
                         className='btn btn-icon btn-light-danger btn-sm px-3'
                         onClick={handleResetFilters}
                       >
                         <KTIcon iconName='arrows-circle' className='fs-3' />
                       </a>                 
                    </div>                
                </div>
        
                <div className='card-body py-3'>
                <TableWithPagination 
                  data={filteredData} 
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
    </>
  );
};

export { OnboardingTable };

import React, { useState, useEffect } from 'react';
import { KTIcon } from '../../../../../../_metronic/helpers';
import { listCandidate, exportExcel, sendSalaryApproval } from '../../core/requests/_request';
import TableWithPagination from '../../../../system.setup/core/helpers/Table Layout/TableWithPagination';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import { JobOfferModal } from '../modals/JobOfferModal';
import Swal from 'sweetalert2';
// import ActionComponent from '../../../../../helpers/action_component';

const JobOfferTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'candidateId', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jobOfferStatusData, setStatusData] = useState([]);

  const [selectedStatus, setStatus] = useState(0);  

  const [ShowJobOfferModal, setShowJobOfferModal] = useState(false);
  const [jobOfferId, setJobOfferId] = useState(null);
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
  const columns = [
    { Header: 'Candidate Id', accessor: 'candidateId', sortable: true, },
    { Header: 'Full Name', accessor: 'candidateName', sortable: true},
    { Header: 'Position', accessor: 'position', sortable: true, },
    { Header: 'Status', accessor: 'jobOfferStatus', sortable: true, },
     
    { Header: 'Actions', accessor: 'id', className: 'text-end', Cell: row => (
      <div className='d-flex justify-content-end flex-shrink-0'>
        {/* <ActionComponent
            buttonPermission={'recruitment.retrieve.candidate.info'}
            actionButton={  */}
        <a
          onClick={() => handleExportExcel(row.candidateId)}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='book' className='fs-3' />
        </a>
        <a
          href={`previewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='send' className='fs-3' />
        </a>
        <a
          onClick={() => handleOpenJobOfferModal(row.candidateId)}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.candidateId}
        >
          <KTIcon iconName='pencil' className='fs-3' />
        </a>
        {/* <a
          href={`viewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='eye' className='fs-3' />
        </a> */}
        <a
          onClick={() => handleSendSalaryApproval(row.candidateId)}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
        >
          <KTIcon iconName='file-right' className='fs-3' />
        </a>
        
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

       useEffect(() => {
         fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
          selectedStatus,);
          
          // console.log(ShowJobOfferModal)
       }, []);

      const handleCloseJobOfferModal = async () => {
        setShowJobOfferModal(false);
      } 

      const handleCloseWithRefreshJobOfferModal = async () => {
        setShowJobOfferModal(false);
        handleResetFilters()
      } 

      const handleOpenJobOfferModal = (id) => {
        setJobOfferId(id);
        setShowJobOfferModal(true);
        console.log('test')
      }; 

      const handleApplicationProcessClick = (statusId) => {
        setStatus(statusId); // Update the state for the selected process
        fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
          statusId,);
      };

      const handleResetFilters = () => {
        setSearchTerm('');
        setStatus(0);
        fetchCandidates('', sortConfig.key, sortConfig.direction, 0, pageSize,
          0,);
      };
  

      const handleExportExcel = async (candidateId) => {
          try {
              const response = await exportExcel(candidateId);
              // Create a Blob from the response data
              const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });

              // Create a download link
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;

              // Optional: customize the filename
              link.download = `Candidate_${candidateId}.xlsx`;
              document.body.appendChild(link);
              link.click();

              // Clean up
              link.remove();
              window.URL.revokeObjectURL(url); 
          } catch (error) {
              Swal.fire({
                  title: 'Error!',
                  text: error.message || 'An error occurred while sending job offer.',
                  icon: 'error',
                  confirmButtonText: 'OK',
              });
          }
      };  
      
      const handleSendSalaryApproval = async (offerId) => {
        try {
          const response = await sendSalaryApproval(offerId);

          console.log(response.data.value)
          if (response?.data?.value) {
            Swal.fire('Email Sent!', 'Email Successfully sent to Hiring Manager.', 'success');
          } else {
            Swal.fire(
              'Failed!',
              res?.data?.responseText || 'An unexpected error occurred.',
              'warning'
            );
          }
      } catch (error) {
          Swal.fire({
              title: 'Error!',
              text: error.message || 'An error occurred while sending job offer.',
              icon: 'error',
              confirmButtonText: 'OK',
          });
      }
      };

  return (
    <>
      <div className='d-flex flex-column flex-md-row gap-2'>
          <div className="card flex-shrink-0 w-100 w-md-25">
            <div className="card-body p-3">
            <div className="d-flex flex-column gap-1">
              <span className='text-center'>Application Status</span>
              <div className="separator border-2 my-2"></div>
                      {jobOfferStatusData.map((process) => {
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
        
                {/* <div className='card-toolbar m-0'>
                  <button
                    type='button'
                    className='btn btn-light-danger btn-sm btn-active-light-danger'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    data-kt-menu-flip='top-end'
                  >
                    <KTIcon iconName='filter' className='fs-3 text-danger' />Filter
                  </button>
                  <a
                    href="#"
                    className='btn btn-icon btn-light-danger btn-active-light-danger btn-sm mx-1'
                    // onClick={handleResetFilters}
                  >
                    <KTIcon iconName='arrows-circle' className='fs-3' />
                  </a>
                </div> */}
                
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
            
            <JobOfferModal show={ShowJobOfferModal} handleClose={handleCloseJobOfferModal} handleCloseWithRefresh={handleCloseWithRefreshJobOfferModal} jobOfferId={jobOfferId}/>
            </div>
          </div>
      </div>
    </>
  );
};

export { JobOfferTable };

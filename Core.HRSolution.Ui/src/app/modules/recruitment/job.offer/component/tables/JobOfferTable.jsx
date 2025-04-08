import React, { useState, useEffect } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { listCandidate, exportExcel } from '../../core/requests/_request';
import TableWithPagination from '../../../../../../app/helpers/table/TableWithPagination';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import { JobOfferModal } from '../modals/JobOfferModal';
// import ActionComponent from '../../../../../helpers/action_component';

const JobOfferTable = ({ className }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

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
        <a
          href={`viewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='eye' className='fs-3' />
        </a>
        <a
          href={`viewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
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
          
          console.log(ShowJobOfferModal)
       }, []);

       const handleCloseJobOfferModal = async () => {
        setShowJobOfferModal(false);
      } 

      const handleOpenJobOfferModal = (id) => {
        setJobOfferId(id);
        setShowJobOfferModal(true);
        console.log('test')
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

  return (
    <div className={`card ${className}`}>
              <div className='card-header flex-nowrap border-0 pt-5'>
                <div className='card-title m-0'>
                  <input
                    type='text'
                    className='form-control form-control-sm me-2'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
        
                <div className='card-toolbar m-0'>
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
      
      <JobOfferModal show={ShowJobOfferModal} handleClose={handleCloseJobOfferModal} jobOfferId={jobOfferId}/>
      </div>
    </div>
  );
};

export { JobOfferTable };

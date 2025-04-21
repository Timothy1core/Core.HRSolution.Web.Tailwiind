import React, { useState, useEffect,useRef } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { listCandidate, exportExcel } from '../../core/requests/_request';
import TableWithPagination from '../../../../../../app/helpers/table/TableWithPagination';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import { JobOfferModal } from '../modals/JobOfferModal';
import { Menu, MenuItem, MenuToggle } from '@/_metronic/components';
// import ActionComponent from '../../../../../helpers/action_component';

const JobOfferTable = ({ className }) => {
  const itemUserRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
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
        setTotalRecords(response.data.recordsTotal);
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
      <div className='d-flex justify-end flex-shrink-0'>
        {/* <ActionComponent
            buttonPermission={'recruitment.retrieve.candidate.info'}
            actionButton={  */}
        <button
          onClick={() => handleExportExcel(row.candidateId)}
          className='btn btn-icon btn-danger btn-outline btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='book' />
        </button>
        <button
          // href={`previewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-danger btn-outline btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='paper-plane' />
        </button>
        <a
          onClick={() => handleOpenJobOfferModal(row.candidateId)}
          className='btn btn-icon btn-danger btn-outline btn-sm me-1'
          data-id={row.candidateId}
        >
          <KTIcon iconName='pencil' className='fs-3' />
        </a>
        <a
          href={`viewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-danger btn-outline btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='eye' className='fs-3' />
        </a>
        <a
          href={`viewjoboffer?id=${row.candidateId}`}
          className='btn btn-icon btn-danger btn-outline btn-sm me-1'
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

       const handleResetFilters = () => {
        setSearchTerm('');
        setStatus(0);
        setCurrentPage(0); // Reset to first page
        fetchCandidates('', sortConfig.key, sortConfig.direction, 0, pageSize,
          0,);
      };

       const handleApplicationProcessClick = (statusId) => {
        setStatus(statusId); // Update the state for the selected process
        fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
          statusId,);
      };

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
    <div className="flex flex-col lg:flex-row gap-2">
          <div className="lg:basis-1/6 md:basis-1/3 basis-full ">
            <div className="card">
            <div className='card-header justify-center'>
              <span className="text-sm font-bold">
              Application Process
              </span>   
            </div>
            <div className="card-body p-2">
            <div className="d-flex flex flex-col gap-1">
                      {jobOfferStatusData.map((process) => (
                        <btn
                          key={process.statusId}
                          className="group btn btn-sm btn-danger btn-clear flex justify-between flex-column align-items-center"
                          onClick={() => handleApplicationProcessClick(process.statusId)}
                        >
                          <span className='text-black group-hover:text-white'>
                            {process.status}</span>
                            <b>{process.candidateCount > 0 ? process.candidateCount : '0'}</b>
                          
                        </btn>
                      ))}
            </div> 
            </div>
            
            </div>
          </div>
          <div className="lg:basis-5/6 md:basis-2/3 basis-full">
            <div className={`card min-w-full ${className}`}>
            <div className="card-header">
              <h4 className="card-title">
              {/* Candidate Dashboard */}
              </h4>
              <div className="card-toolbar">
                      <div className='input-group rounded-md border'>
                        <label className="input input-sm">
                          <KTIcon iconName='magnifier' />
                          <input type="text" placeholder="Search assessment" value={searchTerm} onChange={handleSearch} />
                        </label>
                        {/* <span className='btn btn-danger btn-outline btn-sm' ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
                                placement: 'bottom-start',
                                modifiers: [{
                                  name: 'offset',
                                  options: {
                                    offset: [-20, 10] // [skid, distance]
                                  }
                                }]
                              }}>
                          <MenuToggle>
                            <KTIcon iconName='setting-4' />
                          </MenuToggle>
                            {DropdownUser({
                                  menuItemRef: itemUserRef
                                })}
                        </span> */}  
                        <span
                                type='reset'
                                className='btn btn-sm btn-warning btn-outline btn-clear  border-warning'
                                data-kt-menu-dismiss='true'
                                onClick={handleResetFilters}
                              >
                                <KTIcon iconName='arrows-loop' />
                        </span>
                      </div>
                    </div>
            </div>
            
                <TableWithPagination 
            data={filteredData} 
            columns={columns} 
            isLoadingValue={tableLoading}
            totalRecords={totalRecords}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            />
            {/* </div> */}
          </div>
          </div>
        </div>
    
  );
};

export { JobOfferTable };

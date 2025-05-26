import React, { useState, useEffect } from 'react';
import { KTIcon } from '../../../../../../_metronic/helpers';
import { listCandidate, SelectFilterDropdown } from '../../core/requests/_request';
import TableWithPagination from '../../../../system.setup/core/helpers/Table Layout/TableWithPagination';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import ActionComponent from '../../../../../helpers/action_component';

const CandidateTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [applicationProcessData, setAppProcessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [jobProfiles, setJobProfiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientGroups, setClientGroups] = useState([]);
  const [sources, setSources] = useState([]);

  const [selectedClient, setSelectedClient] = useState(0); // State for selected client
  const [selectedClientGroup, setSelectedClientGroup] = useState(0); // State for selected client
  const [selectedJob, setSelectedJob] = useState(0); // State for selected job
  const [selectedSource, setSelectedSource] = useState(0); // State for selected job
  const [selectedQualification, setSelectedQualification] = useState(0); // State for selected job

  const [selectedProcess, setSelectedProcess] = useState(0); // State for selected job
  
  const fetchCandidates = (   
    searchValue = '',
   sortKey = '',
   sortDirection = 'asc',
   page = 0,
   size = 10,
   client = 0,
   clientGroup= 0,
   job = 0,
   qualification = 0,
   source = 0,
   applicationProcess = 0
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
      client,
      clientGroup,  
      job, 
      qualification, 
      source, 
      applicationProcess)
      .then(response => {
        setFilteredData(response.data.data);
        setTotalRecords(response.data.recordsTotal);
        setAppProcessData(response.data.processCounts)
      })
      .catch(err => {
        console.error("Error fetching permissions:", err);
      })
      .finally(() => {
              disableLoadingRequest()
      setTableLoading(false)

            });
  };

  const fetchPipeline = ( ) => {


    SelectFilterDropdown()
      .then(response => {

        setJobProfiles(response.data.job)
        setClients(response.data.client)
        setClientGroups(response.data.clientGroup)
        setSources(response.data.source)
      })
      .catch(err => {
        console.error("Error fetching permissions:", err);
      })
  };

  

    const handleSortChange = (key, direction) => {
       setSortConfig({ key, direction });
       fetchCandidates(searchTerm, key, direction, currentPage, pageSize,
        selectedClient,
        selectedClientGroup,
        selectedJob,
        selectedProcess,
        selectedSource,
        selectedQualification); // Fetch roles with updated sorting
     };
   
     const handlePageSizeChange = (size) => {
       setPageSize(size);
       setCurrentPage(0); // Reset to first page
       fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, 0, size,
        selectedClient,
        selectedClientGroup,
        selectedJob,
        selectedProcess,
        selectedSource,
        selectedQualification);
     };
   
     const handlePageChange = (page) => {
       setCurrentPage(page);
       fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, page, pageSize,
        selectedClient,
        selectedClientGroup,
        selectedJob,
        selectedProcess,
        selectedSource,
        selectedQualification);
     };

     const handleFilter = () => {
      fetchCandidates(
        searchTerm,
        sortConfig.key,
        sortConfig.direction,
        currentPage,
        pageSize,
        selectedClient,
        selectedClientGroup,
        selectedJob,
        selectedQualification,
        selectedSource,
      );
    };

    const handleApplicationProcessClick = (applicationProcessId) => {
      setSelectedProcess(applicationProcessId); // Update the state for the selected process
      fetchCandidates(
        searchTerm,
        sortConfig.key,
        sortConfig.direction,
        currentPage,
        pageSize,
        selectedClient,
        selectedClientGroup,
        selectedJob,
        selectedQualification,
        selectedSource,
        applicationProcessId // Pass the selected process ID
      );
    };
   
     useEffect(() => {
       fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
        selectedClient,
        selectedClientGroup,
        selectedJob,
        selectedSource,
        selectedQualification);
       fetchPipeline();
     }, []);
   
   
     let debounceTimeout;
   
     const handleSearch = (e) => {
       const value = e.target.value;
       setSearchTerm(value);
     
       if (debounceTimeout) {
         clearTimeout(debounceTimeout);
       }
     
       debounceTimeout = setTimeout(() => {
         fetchCandidates(value , sortConfig.key, sortConfig.direction,currentPage, pageSize,
          selectedClient,
          selectedClientGroup,
          selectedJob,
          selectedProcess,
          selectedQualification); // Fetch roles with the current search term
       }, 300); // 300ms debounce delay
     };

     const handleResetFilters = () => {
      setSearchTerm('');
      
      setSelectedClient(0);
      setSelectedClientGroup(0);
      setSelectedJob(0);
      setSelectedSource(0);
      setSelectedQualification(0); // Reset to Qualified
    
        fetchCandidates(
          '',
          sortConfig.key,
          sortConfig.direction,
          0,
          pageSize,
          0,
          0,
          0,
          0,
          0
        );
      };

  const columns = [
    { Header: 'Id', accessor: 'id', sortable: true, },
    { Header: 'Full Name', accessor: 'firstName', sortable: true,
      Cell: row => (
        row.firstName + " " + row.lastName
        )
     },
     { Header: 'Email', accessor: 'email', sortable: true, },
    { Header: 'Job Title', accessor: 'jobName', sortable: true, },
    { Header: 'Stage', accessor: 'stageName', sortable: true, },
    { Header: 'Source', accessor: 'sourceName', sortable: true, },
  
    { Header: 'Actions', accessor: 'id', className: 'text-end', Cell: row => (
      <div className='d-flex justify-content-end flex-shrink-0'>
        <ActionComponent
            buttonPermission={'recruitment.retrieve.candidate.info'}
            actionButton={ 
        <a
          href={`viewcandidate?id=${row.id}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='eye' className='fs-3' />
        </a>
        }/>
    </div>
      )
    },
  ];
  

  // useEffect(() => {
  //   fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
  //   return () => {
  //   };
  // }, []);

  return (
    <>
    <div className='d-flex flex-column flex-md-row gap-2'>
      <div className="card flex-shrink-0 w-100 w-md-25">
        <div className="card-body p-3">
        <div className="d-flex flex-column gap-1">
          <span className='text-center'>Application Status</span>
          <div className="separator border-2 my-2"></div>
                  {applicationProcessData.map((process) => {
                    const isSelected = process.applicationProcessId === selectedProcess;
                    return (
                    <a
                      key={process.applicationProcessId}
                      className={`btn btn-sm ${isSelected ? 'btn-danger' : 'btn-light-danger'} btn-clear d-flex justify-content-between align-items-center`}
                      onClick={() => handleApplicationProcessClick(process.applicationProcessId)}
                    >
                      <span className={`text-${isSelected ? 'white' : 'dark'}`}>{process.processName}</span><b>{process.candidateCount > 0 ? process.candidateCount : '0'}</b>
                      
                    </a>
                  )
                })}
        </div> 
        </div>
        
      </div>
      <div className="card flex-grow-1">
              <div className='card-header flex-nowrap border-0 pt-5'>
                <div className='card-title m-0'>
                  {/* <input
                    type='text'
                    className='form-control form-control-sm me-2'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={handleSearch}
                  /> */}
                </div>
        
                <div className='card-title m-0'>
                  <input
                    type='text'
                    className='form-control form-control-sm me-2'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <button
                    type='button'
                    className='btn btn-icon btn-light-danger btn-sm btn-active-light-danger px-3'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    data-kt-menu-flip='top-end'
                  >
                    <KTIcon iconName='filter' className='fs-3 text-danger' />
                  </button>
                  <a
                    href="#"
                    className='btn btn-icon btn-light-danger btn-active-light-danger btn-sm ms-2 px-3'
                    onClick={handleResetFilters}
                  >
                    <KTIcon iconName='arrows-circle' className='fs-3' />
                  </a>
        
                  <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px mh-400px overflow-auto' data-kt-menu='true'>
                    <div className='px-7 py-5'>
                      <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
                    </div>

                    <div className='separator border-gray-200'></div>

                    <div className='px-7 py-5'>
                      <div className='mb-5'>
                        <label className='form-label fw-bold'>Department:</label>
                        <div>
                          <select
                            className='form-select form-select-solid'
                            onChange={(e) => setSelectedClient(e.target.value)}
                            value={selectedClient}
                          >
                            <option value='0' hidden>All</option>      
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                  {client.label}
                                </option>
                          ))}
                          </select>   
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label className='form-label fw-bold'>Department Group:</label>

                        <div>
                          <select
                          value={selectedClientGroup}
                            className='form-select form-select-solid'
                            onChange={(e) => setSelectedClientGroup(e.target.value)}
                          >
                            <option value='0' hidden>All</option>      
                            {clientGroups.map((clientGroup) => (
                                <option key={clientGroup.id} value={clientGroup.id}>
                                  {clientGroup.label}
                                </option>
                          ))}
                          </select>   
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label className='form-label fw-bold'>Job:</label>

                        <div>
                        <select
                          className='form-select form-select-solid'
                          onChange={(e) => setSelectedJob(e.target.value)}
                          value={selectedJob}
                        >
                          <option value='0' hidden>All</option>
                          {jobProfiles.map((job) => (
                                <option key={job.id} value={job.id}>
                                  {job.position}
                                </option>
                          ))}
                        </select>  
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label className='form-label fw-bold'>Source:</label>

                        <div>
                        <select
                          className='form-select form-select-solid'
                          onChange={(e) => setSelectedSource(e.target.value)}
                          value={selectedSource}
                        >
                          <option value='0' hidden>All</option>
                          {sources.map((source) => (
                                <option key={source.id} value={source.id}>
                                  {source.label}
                                </option>
                          ))}
                        </select>  
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label className='form-label fw-bold'>Qualification:</label>
                        <div className="form-check form-check-custom form-check-solid form-check-danger form-check-sm mb-1">
                          <input className="form-check-input" type="radio" name='1' value="0" checked={selectedQualification == 0} id="flexRadioLg2" onChange={(e) => setSelectedQualification(e.target.value)}/>
                          <label className="form-check-label me-2" for="flexRadioLg2">
                              Qualified
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid form-check-danger form-check-sm">
                            <input className="form-check-input" type="radio" name='1' checked={selectedQualification == 1} value="1" id="flexRadioLg1" onChange={(e) => setSelectedQualification(e.target.value)}/>
                            <label className="form-check-label me-2" for="flexRadioLg1">
                                Disqualified
                            </label>
                        </div>
                      </div>
                      
                      <div className='d-flex justify-content-end'>
                        <button
                          type='reset'
                          className='btn btn-sm btn-light btn-active-light-primary me-2'
                          data-kt-menu-dismiss='true'
                          onClick={handleResetFilters}
                        >
                          Reset
                        </button>

                        <button type='submit' onClick={handleFilter} className='btn btn-sm btn-primary' data-kt-menu-dismiss='true'>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
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

export { CandidateTable };

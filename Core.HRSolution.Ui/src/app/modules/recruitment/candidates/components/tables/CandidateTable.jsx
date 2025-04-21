import React, { useState, useEffect,useRef  } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { listCandidate, SelectFilterDropdown } from '../../core/requests/_request';
import TableWithPagination from '../../../../../helpers/table/TableWithPagination';
import {
  useLoading,
} from '../../../../../helpers/loading/loading_provider';
import ActionComponent from '../../../../../helpers/action_component';
import { Menu, MenuItem, MenuToggle } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { Link } from 'react-router-dom';
import { DropdownCandidateFilter } from '../dorpdownFilter/DropdownCandidateFilter';

const CandidateTable = ({ className }) => {
  const itemUserRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [applicationProcessData, setAppProcessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedProcess, setSelectedProcess] = useState(0); // State for selected job

  const { enableLoadingRequest, disableLoadingRequest } = useLoading();
  
  const [filters, setFilters] = useState({
    selectedClient: 0,
    selectedClientGroup: 0,
    selectedJob: 0,
    selectedSource: 0,
    selectedQualification: 0,
  });

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


  

    const handleSortChange = (key, direction) => {
       setSortConfig({ key, direction });
       fetchCandidates(searchTerm, key, direction, currentPage, pageSize,
        filters.selectedClient,
        filters.selectedClientGroup,
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
        filters.selectedClient,
        filters.selectedClientGroup,
        filters.selectedJob,
        filters.selectedQualification,
        filters.selectedSource
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
        filters.selectedClient,
        filters.selectedClientGroup,
        filters.selectedJob,
        filters.selectedSource,
        filters.selectedQualification,
        applicationProcessId // Pass the selected process ID
      );
    };
   
     useEffect(() => {
       fetchCandidates(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize,
        filters.selectedClient,
        filters.selectedClientGroup,
        filters.selectedJob,
        filters.selectedSource,
        filters.selectedQualification);
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
          filters.selectedClient,
          filters.selectedClientGroup,
          filters.selectedJob,
          filters.selectedProcess,
          filters.selectedQualification); // Fetch roles with the current search term
       }, 300); // 300ms debounce delay
     };

     const handleResetFilters = () => {
      setSearchTerm('');
      setFilters({
        selectedClient: 0,
        selectedClientGroup: 0,
        selectedJob: 0,
        selectedSource: 0,
        selectedQualification: 0,
      });
      setSelectedProcess(0);
      setCurrentPage(0); // Reset to first page
      fetchCandidates(
        '',
        sortConfig.key,
        sortConfig.direction,
        0,
        pageSize,
        0, // Reset filters
        0,
        0,
        0,
        0 // Ensure "Qualified" is selected
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
  
    { Header: 'Actions', accessor: 'id', className: 'text-right text-blue-600', Cell: row => (
      <div className='d-flex justify-end flex-shrink-0'>
        <ActionComponent
            buttonPermission={'recruitment.retrieve.candidate.info'}
            actionButton={ 
        // <button className="btn btn-icon btn-primary btn-danger btn-xs"
        //   href={`viewcandidate?id=${row.id}`}
        //   // className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
        //   data-id={row.id}
        // >
        //   {/* <KTIcon iconName='eye' className='text-md' /> */}
        //   <i className="ki-outline  ki-eye"></i>
        // </button>
        <Link className="btn btn-icon btn-danger btn-outline btn-xs"
                      to={`/recruitment/viewcandidate?id=${row.id}`}
                  data-id={row.id}
                >
                  <KTIcon iconName='eye' />
                </Link>
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
                  {applicationProcessData.map((process) => (
                    <btn
                      key={process.applicationProcessId}
                      className="group btn btn-sm btn-danger btn-clear flex justify-between flex-column align-items-center"
                      onClick={() => handleApplicationProcessClick(process.applicationProcessId)}
                    >
                      <span className='text-black group-hover:text-white'>{process.processName}</span><b>{process.candidateCount > 0 ? process.candidateCount : '0'}</b>
                      
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
                    <Menu>
                      <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
                      placement: 'bottom-start',
                      modifiers: [{
                        name: 'offset',
                        options: {
                          offset: [-20, 10] // [skid, distance]
                        }
                      }]
                    }}>
                        <MenuToggle className="btn btn-danger btn-outline btn-sm rounded-none  btn-clear ">
                        <KTIcon iconName='setting-4' />
                        </MenuToggle>
                        {/* <DropdownCandidateFilter 
                          menuItemRef={itemUserRef} 
                          filters={filters} 
                          setFilters={setFilters} 
                          onApply={handleFilter}
                        /> */}
                         {DropdownCandidateFilter({
                        menuItemRef: itemUserRef,
                        filters: filters,
                        setFilters: setFilters,
                        onApply: handleFilter
                      })}
                      </MenuItem>
                    </Menu>
                    <div class="border-l-2 border-gray ..."></div>     
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

  </>
  );
};

export { CandidateTable };

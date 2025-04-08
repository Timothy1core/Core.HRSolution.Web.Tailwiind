import React, { useState, useEffect } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { listAssessment, removeAssessment } from '../../core/requests/_request';
// import { Modal } from 'bootstrap';
import {format} from 'date-fns';
import TableWithPagination from '@/app/helpers/table/TableWithPagination';

// import { CreateAppModal } from '../../../../../../_metronic/partials';
// import { CreateAssessment } from '../modals/create-question-to-db/CreateAssessment';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import Swal from 'sweetalert2';
import ActionComponent from '../../../../../helpers/action_component';

const AssessmentTable = ({ className }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [tableLoading, setTableLoading]  = useState(false);

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

  const fetchAssessments = (   
    searchValue = '',
   sortKey = '',
   sortDirection = 'asc',
   page = 0,
   size = 10) => {
    enableLoadingRequest()
    setTableLoading(true)
    listAssessment(searchValue, columns, sortKey, sortDirection, page, size)
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

  const handleDeleteAssessment = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Assessment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeAssessment(id);
          if (res?.data?.success) {
            Swal.fire('Deleted!', 'The Assessment has been deleted.', 'success');
            fetchAssessments(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
          } else {
            console.warn(res?.data?.responseText || 'Unexpected response.');
            Swal.fire(
              'Deletion Failed!',
              res?.data?.responseText || 'An unexpected error occurred.',
              'warning'
            );
          }
        } catch (error) {
          const errorMessage = 'Failed to delete the Assessment.';
          console.error(errorMessage);
          Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  

 const handleSortChange = (key, direction) => {
     setSortConfig({ key, direction });
     fetchAssessments(searchTerm, key, direction, currentPage, pageSize); // Fetch roles with updated sorting
   };
 
   const handlePageSizeChange = (size) => {

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
 
 
   let debounceTimeout;
 
   const handleSearch = (e) => {
     const value = e.target.value;
     setSearchTerm(value);
   
     if (debounceTimeout) {
       clearTimeout(debounceTimeout);
     }
   
     debounceTimeout = setTimeout(() => {
       fetchAssessments(value , sortConfig.key, sortConfig.direction,currentPage, pageSize); // Fetch roles with the current search term
     }, 300); // 300ms debounce delay
   };
 

  const columns = [
    { Header: 'Name', accessor: 'name', sortable: true, },
    { Header: 'Duration', accessor: 'duration', sortable: true, },
    { Header: 'Creation Time', accessor: 'createdDate', sortable: true,
      Cell: row => (
        format(new Date(row.createdDate), 'MMMM d, yyyy')
        )
     },
    { Header: 'Actions', accessor: 'id', className: 'text-end', Cell: row => (
      <div className='d-flex justify-content-end flex-shrink-0'>
        <ActionComponent
            buttonPermission={'system.update.assessment'}
            actionButton={ 
        <a
          href={`editAssessment?id=${row.id}`}
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          data-id={row.id}
        >
          <KTIcon iconName='pencil' className='fs-3' />
        </a>
        }/>
        <ActionComponent
            buttonPermission={'system.remove.assessment'}
            actionButton={ 
        <a
          href='#'
          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
          onClick={() => handleDeleteAssessment(row.id)}
        >
          <KTIcon iconName='trash' className='fs-3' />
        </a>
        }/>
    </div>
      )
    },
  ];

  useEffect(() => {
    fetchAssessments(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
    return () => {
    };
  }, []);

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
      <h3 className='card-title align-items-start flex-column'>
      <ActionComponent
            buttonPermission={'system.create.assessment'}
            actionButton={ 
          <a
            href='/recruitment/createAssessment'
            className='btn btn-sm btn-light-danger'
            // data-bs-toggle='modal'
            // data-bs-target='#create-assessment'
            // data-edit='false'
          >
            <KTIcon iconName='plus' className='fs-3' />
            Add New Assessment
          </a>
            }/>
          
        {/* <CreateAppModal show={showCreateAppModal} handleClose={() => setShowCreateAppModal(false)} /> */}
        </h3>
        <div className="card-toolbar">
          <div className='d-flex'>
            <input
              type='text'
              className='form-control form-control-sm me-2'
              placeholder='Search'
              value={searchTerm}
              onChange={handleSearch}
            />
            {/* <button href='#' className='btn btn-sm btn-light-danger' onClick={handleSearch}>
              Search
            </button> */}
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
      {/* <CreateEditAssessment /> */}
      {/* <CreateAssessment /> */}
      {/* <DeleteAssessment /> */}
    </div>
  );
};

export { AssessmentTable };

import React, { useState, useEffect } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { listSectionMenu, removeSectionMenu } from '../../core/requests/_request';
import { format } from 'date-fns';
import TableWithPagination from '../../../../../../app/helpers/table/TableWithPagination';
import { CreateEditSectionMenu } from '../modals/create-or-edit-section-menu/CreateEditSectionMenu';
import Swal from 'sweetalert2';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';
import ActionComponent from '../../../../../helpers/action_component';

const SectionMenuTable = ({ className }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedSectionMenuId, setSelectedSectionMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch menu data from API
  const fetchSectionMenu = (
    searchValue = '',
    sortKey = '',
    sortDirection = 'asc',
    page = 0,
    size = 10) => {
    enableLoadingRequest()
    setTableLoading(true)

    listSectionMenu(searchValue, columns, sortKey, sortDirection, page, size)
      .then(response => {
        const sectionMenus = response.data.data;
        setFilteredData(sectionMenus); // Set initial filtered data
        setTotalRecords(response.data.recordsTotal);
      })
      .catch(err => {
        console.error("Error fetching section menu data:", err);
      }).finally(() => {
        disableLoadingRequest()
      setTableLoading(false)

      });
  };

const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    fetchSectionMenu(searchTerm, key, direction, currentPage, pageSize); // Fetch roles with updated sorting
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page
    fetchSectionMenu(searchTerm, sortConfig.key, sortConfig.direction, 0, size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchSectionMenu(searchTerm, sortConfig.key, sortConfig.direction, page, pageSize);
  };

  useEffect(() => {
    fetchSectionMenu(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
  }, []);


  let debounceTimeout;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    debounceTimeout = setTimeout(() => {
      fetchSectionMenu(value , sortConfig.key, sortConfig.direction,currentPage, pageSize); // Fetch roles with the current search term
    }, 300); // 300ms debounce delay
  };

  const handleDeleteSectionMenu = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Section Menu?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeSectionMenu(id);
  
          if (res?.data?.success) {
            Swal.fire('Deleted!', 'The Section Menu has been deleted.', 'success');
            fetchSectionMenu(searchTerm , sortConfig.key, sortConfig.direction,currentPage, pageSize);
          } else {
            console.warn(res?.data?.responseText || 'Unexpected response.');
            Swal.fire(
              'Deletion Failed!',
              res?.data?.responseText || 'An unexpected error occurred.',
              'warning'
            );
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.title || 'Failed to delete the role.';
          console.error(errorMessage);
          Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  // Open modal and set edit mode
  const handleOpenModal = (id = null, mode = false) => {
    setSelectedSectionMenuId(id);
    setEditMode(mode);
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
  };

  // Close modal and refresh data
  const handleCloseWithRefresh = () => {
    handleClose();
    fetchSectionMenu(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
  };


  const columns = [
    { Header: 'Section Menu Name', accessor: 'sectionName', sortable: true },
    { Header: 'Order by', accessor: 'orderBy', className: 'text-center',sortable: true },
    { Header: 'Creation Time', accessor: 'createdDate', sortable: true,
      Cell: row => (
        format(new Date(row.createdDate), 'MMMM d, yyyy')
        )
     },
    {
      Header: 'Actions',
      accessor: 'id',
      className: 'text-end',
      Cell: row => (
        <div className='d-flex justify-content-end flex-shrink-0'>
          <ActionComponent
            buttonPermission={'system.setup.update.section.menu'}
            actionButton={ 
              <a href='#' className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1' onClick={() => handleOpenModal(row.id, true)}>
                <KTIcon iconName='pencil' className='fs-3' />
              </a>
            }/>
            <ActionComponent
            buttonPermission={'system.setup.remove.section.menu'}
            actionButton={ 
          <a
            href='#'
            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
            onClick={() => handleDeleteSectionMenu(row.id)}
          >
            <KTIcon iconName='trash' className='fs-3' />
          </a>
            }/>
        </div>
      ),
    },
  ];

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
        <ActionComponent
            buttonPermission={'system.setup.create.section.menu'}
            actionButton={ 
              <a href='#' className='btn btn-sm btn-light-danger' onClick={() => handleOpenModal(null, false)}>
              <KTIcon iconName='plus' className='fs-3' />
              Add New Section Menu
            </a>
        }/>
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
      <CreateEditSectionMenu 
        id={selectedSectionMenuId} 
        editMode={editMode}
        showModal={showModal} 
        handleClose={handleClose} 
        handleCloseWithRefresh={handleCloseWithRefresh} 
      />
    </div>
    
  );
};

export { SectionMenuTable };

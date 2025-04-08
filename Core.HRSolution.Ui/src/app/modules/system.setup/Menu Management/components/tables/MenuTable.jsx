import React, { useState, useEffect } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { listMenu, removeMenu, updateMenuHiddenStatus } from '../../core/requests/_request';
import TableWithPagination from '../../../core/helpers/Table Layout/TableWithPagination';
import {CreateEditMenu} from '../modals/create-or-edit-menu/CreateEditMenu';
import Swal from 'sweetalert2';
import  ActionComponent  from "../../../../../helpers/action_component";
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';

const MenuTable = ({ className }) => {
  const [menuData, setMenu] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search state
  const [tableLoading, setTableLoading]  = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [isChecked, setIsChecked] = useState(false); // Track the state

  const handleToggle = async (row) => {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to change the visibility of this Menu?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes!',
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                setIsChecked(!row.isHidden); // Optimistically update UI
                // Call API to update isHidden state in the backend
                const res = await updateMenuHiddenStatus(row.id, !row.isHidden);
                if (res?.data?.success) {
                  Swal.fire('Visibility Changed!', 'The Menu visibility has been changed.', 'success');
                  fetchMenus(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
                }
                else {
                  throw new Error(res?.data?.responseText || 'Failed to update menu visibility');
                }
              } catch (error) {
                console.error(error);
                Swal.fire('Error', error.message, 'error');
                setIsChecked(isChecked); // Revert UI state if API fails
              }
            }
          });
  };        

   // Open modal with id and mode
   const handleOpenModal = (id = null, mode = false) => {
    setSelectedMenuId(id);
    setEditMode(mode);
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
  };

  // Close modal and refresh table
  const handleCloseWithRefresh = () => {
    handleClose();
    fetchMenus(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
  };

  // Fetch menu data from API
  const fetchMenus = (
    searchValue = '',
    sortKey = 'id',
    sortDirection = 'asc',
    page = 0,
    size = 10) => {
    enableLoadingRequest()
    setTableLoading(true)
    listMenu(searchValue, columns, sortKey, sortDirection, page, size)
      .then(response => {
        const menus = response.data.data;
        setFilteredData(menus); // Set initial filtered data
        setMenu(menus)
        setTotalRecords(response.data.recordsTotal)
      })
      .catch(err => {
        console.error("Error fetching menu data:", err);
      }).finally(() => {
        disableLoadingRequest()
        setTableLoading(false)
      });
  };

  const handleDeleteMenu = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Menu?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeMenu(id);
  
          if (res?.data?.success) {
            Swal.fire('Deleted!', 'The Menu has been deleted.', 'success');
            fetchMenus(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
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

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    fetchMenus(searchTerm, key, direction, currentPage, pageSize); // Fetch roles with updated sorting
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page
    fetchMenus(searchTerm, sortConfig.key, sortConfig.direction, 0, size);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMenus(searchTerm, sortConfig.key, sortConfig.direction, page, pageSize);
  };



  let debounceTimeout;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    debounceTimeout = setTimeout(() => {
      fetchMenus(value , sortConfig.key, sortConfig.direction,currentPage, pageSize); // Fetch roles with the current search term
    }, 300); // 300ms debounce delay
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // Create a parent lookup to map parent IDs to their names
  const parentLookup = menuData.reduce((lookup, item) => {
    if (item.isParent) {
      lookup[item.id] = item.menuName; // map parent ID to menu name
    }
    return lookup;
  }, {});

  const columns = [
    { Header: 'Menu Name', accessor: 'menuName', sortable: true, },
    { Header: 'Menu Path', accessor: 'menuPath', sortable: true,  },
    {
      Header: 'Icon',
      accessor: 'menuIcon',
      className: 'text-center',
      sortable: false,
      Cell: row =>
        row.menuIcon ? (
          <a
            href='#'
            className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
          >
            <KTIcon iconName={row.menuIcon} className='fs-3' />
          </a>
        ) : (
          '--'
        ),
    },
    {
      Header: 'Parent',
      accessor: 'isParent',
      className: 'text-center',
      sortable: false,
      Cell: row =>
        row.isParent ? (
          <KTIcon iconName='check-circle' className='fs-1 text-success' />
        ) : (
          <KTIcon iconName='cross-circle' className='fs-1 text-danger' />
        ),
    },
    {
      Header: 'Sub Parent',
      accessor: 'isSubParent',
      className: 'text-center',
      sortable: false,
      Cell: row =>
        row.isSubParent ? (
          <KTIcon iconName='check-circle' className='fs-1 text-success' />
        ) : (
          <KTIcon iconName='cross-circle' className='fs-1 text-danger' />
        ),
    },
    { Header: 'Section', accessor: 'sectionMenu', sortable: true,  },
    {
      Header: 'Parent Name',
      accessor: 'parentId',
      sortable: true, 
      Cell: row => (row.parentId ? parentLookup[row.parentId] || '--' : '--'),
    },
    { Header: 'Order by', accessor: 'orderBy', className: 'text-center' },
    {
      Header: 'Hidden',
      accessor: 'isHidden',
      className: 'text-center',
      sortable: false,
      Cell: row =>
        <ActionComponent
            buttonPermission={'system.setup.hide.user.menu'}
            actionButton={
          <div class="form-check form-switch form-check-custom form-check-solid">
              <input 
              class="form-check-input" 
              type="checkbox" 
              value={row.isHidden} 
              id={`switch-${row.id}`} 
              checked={row.isHidden}
              onChange={() => handleToggle(row)}
              />
          </div>
            }/>
    },
    {
      Header: 'Actions',
      accessor: 'id',
      className: 'text-end',
      sortable: false,
      Cell: row => (
        <div className='d-flex justify-content-end flex-shrink-0'>
          
          <ActionComponent
            buttonPermission={'system.setup.update.user.menu'}
            actionButton={
              <a
              href='#'
              className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
              onClick={() => handleOpenModal(row.id, true)}
            >
              <KTIcon iconName='pencil' className='fs-3' />
            </a>
            }      
          /> 
          <ActionComponent
            buttonPermission={'system.setup.remove.user.menu'}
            actionButton={ 
            <a
              href='#'
              className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
              onClick={() => handleDeleteMenu(row.id)}
            >
              <KTIcon iconName='trash' className='fs-3' />
            </a>
            }      
          /> 
          
        </div>
      ),
    },
  ];

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
        <ActionComponent
                  buttonPermission={'system.setup.create.user.menu'}
                  actionButton={
                    <a href='#' className='btn btn-sm btn-light-danger' onClick={() => handleOpenModal(null, false)}>
                    <KTIcon iconName='plus' className='fs-3' />
                    Add New Menu
                  </a>
                   }
                /> 
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
      <CreateEditMenu 
        id={selectedMenuId} 
        editMode={editMode}
        showModal={showModal} 
        handleClose={handleClose} 
        handleCloseWithRefresh={handleCloseWithRefresh} 
      />
    </div>
  );
};

export { MenuTable };

import React, { useState, useEffect } from 'react';
import { listRole, removeRole } from '../../core/requests/_request';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import TableWithPagination from '../../../../../../app/helpers/table/TableWithPagination';
import { CreateEditRole } from '../modals/create-or-edit-role/CreateEditRole';
import ActionComponent from '../../../../../helpers/action_component';
import { KTIcon } from '@/_metronic/helpers';

const RoleTable = ({ className }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchRoles = (searchValue = '', sortKey = '', sortDirection = 'asc', page = 0, size = 10) => {
    setTableLoading(true);
    listRole(searchValue, columns, sortKey, sortDirection, page, size)
      .then((response) => {
        setFilteredData(response.data.data);
        setTotalRecords(response.data.recordsTotal);
      })
      .catch((err) => {
        console.error('Error fetching roles:', err);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  // Open Modal: Set `editMode` based on action
  const handleOpenModal = (id = null, mode = false) => {
    setSelectedRoleId(id);
    setEditMode(mode);
    setShowModal(true);
  };

  // Close Modal
  const handleClose = () => {
    setShowModal(false);
  };

  // Close Modal & Refresh Table
  const handleCloseWithRefresh = () => {
    handleClose();
    fetchRoles(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
  };
  let debounceTimeout;
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    debounceTimeout = setTimeout(() => {
      fetchRoles(value , sortConfig.key, sortConfig.direction,currentPage, pageSize); // Fetch roles with the current search term
    }, 300); // 300ms debounce delay
  };

  const handleDeleteRole = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeRole(id);
          if (res?.data?.success) {
            Swal.fire('Deleted!', 'The Role has been deleted.', 'success');
            fetchRoles(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
          } else {
            Swal.fire('Deletion Failed!', res?.data?.responseText || 'An unexpected error occurred.', 'warning');
          }
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete the role.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchRoles(searchTerm, sortConfig.key, sortConfig.direction, currentPage, pageSize);
  }, []);

  const columns = [
    {
      Header: 'Role Name',
      accessor: 'role',
      sortable: true,
    },
    {
      Header: 'Creation Time',
      accessor: 'createdDate',
      sortable: true,
      Cell: (row) => format(new Date(row.createdDate), 'MMMM d, yyyy'),
    },
    {
      Header: 'Actions',
      accessor: 'id',
      className: 'text-end',
      sortable: false,
      Cell: (row) => (
        <div className='d-flex justify-content-end flex-shrink-0'>
          <ActionComponent
            buttonPermission={'system.setup.retrieve.role.info'}
            actionButton={ 
              <a href='#' className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1' onClick={() => handleOpenModal(row.id, true)}>
                <KTIcon iconName='pencil' className='fs-3' />
              </a>
            }
          />
          <ActionComponent
            buttonPermission={'system.setup.remove.role'}
            actionButton={ 
              <a href='#' className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm' onClick={() => handleDeleteRole(row.id)}>
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
            buttonPermission={'system.setup.create.role'}
            actionButton={ 
              <a href='#' className='btn btn-sm btn-light-danger' onClick={() => handleOpenModal(null, false)}>
                <KTIcon iconName='plus' className='fs-3' />
                Add New Role
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
          totalRecords={totalRecords}
          isLoadingValue={tableLoading}
          onSortChange={(key, direction) => fetchRoles(searchTerm, key, direction, currentPage, pageSize)}
          onPageChange={(page) => fetchRoles(searchTerm, sortConfig.key, sortConfig.direction, page, pageSize)}
          onPageSizeChange={(size) => fetchRoles(searchTerm, sortConfig.key, sortConfig.direction, 0, size)}
        />
      </div>

      <CreateEditRole 
        id={selectedRoleId} 
        editMode={editMode}
        showModal={showModal} 
        handleClose={handleClose} 
        handleCloseWithRefresh={handleCloseWithRefresh} 
      />
    </div>
  );
};

export { RoleTable };

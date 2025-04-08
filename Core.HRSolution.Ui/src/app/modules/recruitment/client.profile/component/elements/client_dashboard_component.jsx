import React, { useState, useEffect } from 'react';
import { SelectCompanyDashboard, ApiGateWayUrl } from '../../core/request/clients_request';
import { ClientInfoCard } from './client_card_component';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useNavigate } from 'react-router-dom';

function DataClientDashboardComponent({ searchValue, groupId,serviceId, statusId, refresh }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]); // New state for filtered data
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch data once on load or when parameters change
  useEffect(() => {
    setLoading(true);
    SelectCompanyDashboard(groupId,serviceId, statusId)
      .then((response) => {
        setData(response.data.companies);
        setLoading(false);
      })
      .catch((error) => {
        navigate(`/error/${error.status}`);
      });
  }, [groupId,serviceId, statusId, refresh]);

  // Filter data based on searchValue from props
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchValue, data]);

  // Pagination calculation based on filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <TopBarProgress />;
  if (!filteredData.length) {
    return (
      <div className="card card-flush h-md-100">
        <div className="card-body d-flex flex-column justify-content-between mt-9">
          <div className="fs-2hx fw-bold text-gray-800 text-center mb-13">
            <h2 className="text-gray-700 text-uppercase">No Data Available!</h2>
            <i className="fa-duotone fa-face-sad-tear fs-5tx"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Display filtered data */}
      <div className="row g-3 g-xl-6">
        {currentData.map((item) => (
          <div className="col-md-6 col-xl-4" key={item.id}>
            <ClientInfoCard
              id={item.id}
              logo={`${ApiGateWayUrl()}/recruitment/client/client_logo/${item.id}`}
              status={item.status}
              clientCompanyName={item.name}
              industry={item.industry}
              services={item.coreService}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className='d-flex flex-stack flex-wrap pt-10'>
        <div className='fs-6 fw-bold text-gray-700'>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>

        <ul className='pagination'>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className='page-link' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <i className='previous'></i>
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className='page-link' onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className='page-link' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <i className='next'></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { DataClientDashboardComponent };

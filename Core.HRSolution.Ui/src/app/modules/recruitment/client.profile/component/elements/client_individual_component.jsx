import React, { useState, useEffect, useCallback } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { CreateClientIndividualModal } from '../modals/create_client_individual';
import { UpdateClientIndividualModal } from '../modals/update_client_individual';
import { SelectClientIndividuals } from '../../core/request/clients_request';

const getInitials = (fullName) => {
  return fullName
    .split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
};

const ClientIndividualCardList = ({ companyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const cardsPerPage = 8; // Number of cards per page
  const [clientIndividualCardList, setData] = useState([]); // Initialize as an array

  // Fetch data from the server
  const fetchData = useCallback(() => {
    SelectClientIndividuals(companyId)
      .then((response) => {
        // Ensure the data is an array
        setData(response.data.individuals);
      })
      .catch((error) => {
        console.error(error);
        // Handle navigation to error page if necessary
        // navigate(`/error/${error.status}`);
      });
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter cards based on search term
  const filteredCards = clientIndividualCardList.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate indices for slicing data
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  return (
    <div>
      {/* Search Input */}
      <div className="d-flex flex-wrap flex-stack mb-6">
        <div className="d-flex align-items-center position-relative me-4">
          <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-3" />
          <input
            type="text"
            className="form-control form-control-white form-control-sm w-250px ps-9"
            placeholder="Search"
            value={searchTerm}
            onInput={handleSearch}
          />
        </div>
        <div className="d-flex flex-wrap my-2">
          <div className="me-4">
            <CreateClientIndividualModal companyId={companyId} onSuccess={fetchData} />
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="row g-6 g-xl-9">
        {currentCards.map((value, index) => (
          <div className="col-md-6 col-xxl-3" key={`card-${index}`}>
            <div className="card">
              <div className="card-body d-flex flex-center flex-column pt-12 p-9">
                <div className="symbol symbol-65px symbol-circle mb-5 position-relative">
                  <span
                    className={`symbol-label fs-2x fw-semibold bg-danger text-white`}
                  >
                    {getInitials(value.name)}
                  </span>
                  <div className="bg-success position-absolute border border-4 border-body h-15px w-15px rounded-circle translate-middle start-100 top-100 ms-n3 mt-n3"></div>
                </div>
                
                <UpdateClientIndividualModal clientIndividual={value} onSuccess={fetchData}></UpdateClientIndividualModal>
                
                <div className="fw-semibold text-gray-500 mb-6">{value.position}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex flex-stack flex-wrap pt-10">
        <div className="fs-6 fw-bold text-gray-700">
          Showing {(currentPage - 1) * cardsPerPage + 1} to{' '}
          {Math.min(currentPage * cardsPerPage, filteredCards.length)} of{' '}
          {filteredCards.length} entries
        </div>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="previous"></i>
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li className="page-item" key={`page-${index}`}>
              <button
                onClick={() => paginate(index + 1)}
                className={`page-link ${index + 1 === currentPage ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="next"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export { ClientIndividualCardList };

import React, { useState, useEffect, useCallback } from 'react';
import { KTIcon } from '@/_metronic/helpers';
import { Link } from 'react-router-dom';
import { SelectJobProfileDashboard } from '../../core/request/job_profile_request';
import { SelectClientCompanyGroupComponent } from '../dropdowns/client_profile_dropdown_component';

const ClientJobProfileCardList = ({ companyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(''); // State for department filter
  const cardsPerPage = 9;
  const [ClientJobProfileCardList, setData] = useState([]);

  // Fetch data from the server
  const fetchData = useCallback(() => {
    SelectJobProfileDashboard(companyId)
      .then((response) => {
        setData(response.data.jobProfiles);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter cards based on search term and department
  const filteredCards = ClientJobProfileCardList.filter((card) => {
    const matchesSearch =
      card.jobStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || card.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e) => {
    const selectedText = e.target.options[e.target.selectedIndex].text; 
    setSelectedDepartment(selectedText); 
    setCurrentPage(1); 
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="d-flex flex-wrap flex-stack mb-6">
        <div className="d-flex align-items-center position-relative me-4">
          <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-3" />
          <input
            type="text"
            className="form-control form-control-white form-control-sm w-250px ps-9"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="d-flex flex-wrap my-2">
          <div className="me-4">
            <Link to="/recruitment/createjobprofile" className="btn btn-dark btn-sm">
              Create New Job Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="row g-6 g-xl-9">
        {currentCards.map((value, index) => (
          <div className="col-md-6 col-xxl-3" key={`card-${index}`}>
            <div className="card border border-2 border-gray-300 border-hover">
              <div className="card-body d-flex flex-column p-0">
                <div className="d-flex flex-stack flex-grow-1 card-p">
                  <div className="d-flex flex-column me-2">
                    <Link
                      to={`/recruitment/editjobprofile/${value.id}`}
                      className="text-gray-900 text-hover-primary fw-bold fs-3"
                    >
                      {value.position}
                    </Link>
                    <div className="mt-3">
                      <span className="badge badge-light-primary me-3">
                        {value.employmentType}
                      </span>
                      <span className="badge badge-light-info">
                        {value.jobStatus}
                      </span>
                    </div>
                  </div>
                  <div className="me-0">
                    <button
                      className="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                      data-kt-menu-trigger="click"
                      data-kt-menu-placement="bottom-end"
                      data-kt-menu-flip="top-end"
                    >
                      <i className="bi bi-three-dots fs-3"></i>
                    </button>
                    <div className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-auto min-w-200 mw-300px' data-kt-menu='true'>
                        <div className="menu-item px-3">
                            <div className="menu-content fs-6 text-gray-900 fw-bold px-3 py-4">Application Form Links</div>
                        </div>
                        <div className='separator border-gray-200'></div>
                        <div className="menu-item px-3 py-5">
                            <Link to={`/apply/jobs/${value.id}4`} className="menu-link px-3" target="_blank">
                                Jobstreet Link
                            </Link>
                        </div>
                    </div>
                  </div>
                </div>
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

export { ClientJobProfileCardList };

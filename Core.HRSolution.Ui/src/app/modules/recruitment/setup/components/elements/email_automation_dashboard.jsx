import React, { useState, useEffect } from 'react';
import { SelectEmailAutomation } from '../../request/email_template';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useNavigate } from 'react-router-dom';
import { EditEmailAutomationModal } from '../modals/update_email_automation';

function DataEmailAutomationDashboardComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data once on load
  useEffect(() => {
    setLoading(true);
    SelectEmailAutomation()
      .then((response) => {
        setData(response.data.automations || []); // Ensure data is an array
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching email templates:', error);
        navigate(`/error/${error.status}`);
        setLoading(false);
      });
  }, [navigate]);

  const refreshData = () => {
    SelectEmailAutomation()
      .then((response) => {
        setData(response.data.automations || []);
      })
      .catch((error) => {
        console.error('Error refreshing data:', error);
      });
  };

  if (loading) return <TopBarProgress />;

  return (
    <div>
      <div className="row g-3 g-xl-6">
        {data.length > 0 ? (
          data.map((automation) => (
            <div key={automation.id} className="col-4">
              <div className="card shadow-sm parent-hover">
                <div className="card-body d-flex align-items">
                  <div className="d-flex flex-stack flex-grow-1 card-p">
                    <span className="ms-3 text-gray-700 parent-hover-primary fs-7 fw-bold me-2">
                      {automation.emailAutomation}
                    </span>
                  
                
                    <div className="me-0">
                      <button className="btn btn-sm btn-icon btn-bg-light btn-active-color-danger" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                        <i className="bi bi-three-dots fs-3"></i>
                      </button>
                    <div className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-auto min-w-200 mw-300px' data-kt-menu='true'>
                      <div className="menu-item px-3">
                        <div className="menu-content fs-6 text-gray-900 fw-bold px-3 py-4">Actions</div>
                      </div>
                      <div className='separator border-gray-200'></div>
                      <div className="menu-item px-3 py-5">
                        <EditEmailAutomationModal automation={automation} onUpdate={refreshData} />
                      </div>
                      </div>
                    </div>                  
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted text-center">No email templates available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { DataEmailAutomationDashboardComponent };

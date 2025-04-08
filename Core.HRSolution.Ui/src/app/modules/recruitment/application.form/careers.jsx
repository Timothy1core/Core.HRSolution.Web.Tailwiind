import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation
import { JobPostedList } from './core/application_form_request';
import { toAbsoluteUrl } from '@/_metronic/utils';;
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const CareerPage = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch data from JobPostedList
    const fetchData = useCallback(async () => {
        try {
            const response = await JobPostedList();
            console.log(response);
            if (response?.data?.jobProfiles) {
                setData(response.data.jobProfiles);
            }
        } catch (err) {
            navigate(`/error/400`); // Navigate to error page on failure
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
            <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                {/* Header Section */}
                <div
                    id="kt_app_header"
                    className="app-header h-200px bg-white bgi-no-repeat"
                    data-kt-sticky="true"
                    data-kt-sticky-activate="{default: true, lg: true}"
                    data-kt-sticky-name="app-header-minimize"
                    data-kt-sticky-offset="{default: '200px', lg: '0'}"
                    data-kt-sticky-animation="false"
                    style={{
                        backgroundPosition: 'right top',
                        backgroundSize: '20% auto',
                        backgroundImage: `url(${toAbsoluteUrl('media/svg/shapes/abstract-2.svg')})`,
                    }}
                >
                    <div className="app-container mx-20" id="kt_app_header_container">
                        <div className="d-flex align-items-center py-10">
                            <a href="index.html">
                                <img
                                    alt="Logo"
                                    src="https://cdn.onecoredevit.com/logos/core-logo-gray-text.png"
                                    className="h-100px h-lg-70px app-sidebar-logo-default"
                                />
                            </a>
                        </div>
                        <h1 className='fs-1 text-uppercase'>Careers at One CoreDev IT (CORE)</h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
                    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                        <div id="kt_app_content" className="app-content flex-column-fluid">
                            <div id="kt_app_content_container" className="app-container mx-20">

                                <div className="row">
                                    {data && data.length > 0 ? (
                                        data.map((job, index) => (
                                            <div className="col-3" key={index}>
                                                <div className="card">
                                                    <div className="card-body py-10">
                                                        <div className="text-gray-700">
                                                            <h2 className="fs-2 mb-5 fw-bold">{job.position || 'Job Title'}</h2>
                                                            <p className="fs-6 mb-1 text-dark">Makati, Metro Manila, Philippines</p>
                                                            <p className="fs-7 text-muted">{job.employmentType}</p>
                                                            <p className="fs-6 text-muted">{dayjs(job.datePosted).fromNow()}
                                                            </p>

                                                        </div>
                                                        
                                                        <Link to={`/jobs/apply/${job.id}3`} className='btn btn-danger btn-sm w-100'>APPLY</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center">No job postings available.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div id="kt_app_footer" className="app-footer">
                            <div className="app-container mx-20 d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                                <div className="text-gray-900 order-2 order-md-1">
                                    <span className="text-muted fw-semibold me-1">
                                        {new Date().getFullYear()} &copy;
                                    </span>
                                    <a
                                        href="https://onecoredevit.com/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-800 text-hover-danger"
                                    >
                                        One CoreDev IT (CORE)
                                    </a>
                                </div>
                                <ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
                                    <li className="menu-item">
                                        <a
                                            href="https://www.facebook.com/onecoredevit"
                                            className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"
                                        >
                                            <i className="fab fa-facebook-f fs-4"></i>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="#"
                                            className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"
                                        >
                                            <i className="fa-brands fa-linkedin-in fs-4"></i>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="#"
                                            className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"
                                        >
                                            <i className="fa-brands fa-tiktok fs-4"></i>
                                        </a>
                                    </li>
                                    <li className="menu-item">
                                        <a
                                            href="#"
                                            className="btn btn-sm btn-icon btn-light-dark me-2 bg-white"
                                        >
                                            <i className="fa-brands fa-x-twitter fs-4"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CareerPage };

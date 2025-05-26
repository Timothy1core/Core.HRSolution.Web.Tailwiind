import { KTIcon, toAbsoluteUrl } from '../../_metronic/helpers';
// import { toAbsoluteUrl } from '@/utils';
import { InboxCompose, useThemeMode } from '../../_metronic/partials';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

import React, { useState } from 'react';
const UserProfileHero = ({ image, name, info }) => {
  const { mode } = useThemeMode();
  const cardBg = mode === 'light' ? 'abstract-4-dark.svg' :'abstract-11.svg'



  // const { mode } = useThemeMode()
  const buildInfo = (info) => {
    return info.map((item, index) => (
      <div className="d-flex align-items-center gap-2" key={`info-${index}`}>
        {item.icon && <i className={`fa-solid ${item.icon}`}></i>}
        {item.email ? (
          <a
            href={`mailto:${item.email}`}
            target="_blank"
            className="text-dark fw-medium text-decoration-none hover-primary"
            rel="noreferrer"
          >
            {item.email}
          </a>
        ) : (
          <span className="text-dark fw-medium">{item.label}</span>
        )}
      </div>
    ));
  };

  const render = () => {
    return (
      <div
        className="hero-bg text-start p-9 py-5 "
        style={{
          backgroundImage: //getThemeMode() === 'dark'?
             `url('${toAbsoluteUrl(`/media/svg/shapes/${cardBg}`)}')`,
            // : `url('${toAbsoluteUrl(`/media/svg/shapes/${cardBg}`)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2">
                  <h1 className="card-title mb-0 fw-bold">{name}</h1>
              </div>
              <div className="d-flex align-items-between gap-3 py-4">
                <div className="text-dark gap-3 text-sm">
                  {buildInfo(info)}
                </div>
                
              </div>
              </div>
              <div className="text-end align-items-end justify-content-center">
                <ButtonToolbar aria-label="Toolbar with button groups" className='text-end'>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                  <Button variant='light' className="btn-icon btn-icon-lg size-9 " >
                    <KTIcon iconName='trash' className='fs-3 '/>
                  </Button>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                    <Button variant='light' type="button" id="kt_drawer_copy_to_job_button" className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='copy' className='fs-3'/>
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1 pe-0" aria-label="First group">
                    <Button variant='light' type="button" id="kt_drawer_move_to_job_button" className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='arrow-up-right' className='fs-3' />
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                    <Button variant='light'  className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='badge' className='fs-3'/>
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup size="sm" className=" py-1 pe-0" aria-label="First group">
                    {/* <Button variant='light' className="btn-icon btn-icon-lg size-9 text-gray-500 hover-bg-primary-light hover-text-primary" >
                      <KTIcon iconName='badge' className='fs-3' />move to stage
                    </Button> */}
                    <Button variant='light' type="button" id="kt_drawer_example_basic_button">
                      Move to Stage <KTIcon iconName='double-right' className='fs-3'/>
                    </Button>
                    {/* <button variant='light' id="kt_drawer_example_basic_button" class="btn btn-light-secondary">move to stage</button> */}
                  </ButtonGroup>
                </ButtonToolbar>
              </div>
            
          </div>
            
        </div>
      </div>
    );
  };

  return render();
};

export { UserProfileHero };

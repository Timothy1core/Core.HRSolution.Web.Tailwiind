import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import {
  JobOfferTable,
} from '../component/tables/JobOfferTable'
import React from 'react';

const JobOfferPage = () => {

  return(
  <>
    <Content>
      <JobOfferTable className='mb-5 mb-xl-8' />
    </Content>
  </>
  )
  
}

const JobOfferWrapper = () => {
  return (
    <>
      <JobOfferPage />
    </>
  )
}

export { JobOfferWrapper }

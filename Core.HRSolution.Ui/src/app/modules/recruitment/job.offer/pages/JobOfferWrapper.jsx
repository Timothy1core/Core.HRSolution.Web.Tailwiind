import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import {
  JobOfferTable,
} from '../component/tables/JobOfferTable'
import React from 'react';

const JobOfferPage = () => {

  return(
  <>
    <ToolbarWrapper title="Job Offer Dashboard" subtitle="Recruitment" />
    <Content>
      <JobOfferTable/>
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

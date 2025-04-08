import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import {
  AssessmentTable,
} from '../components/tables/AssessmentTable'
import React from 'react';

const AssessmentManagementPage = () => {

  return(
  <>
    <ToolbarWrapper title="Assessment Management" subtitle="Recruitment" />
    <Content>
      <AssessmentTable className='mb-5 mb-xl-8' />
    </Content>
  </>
  )
  
}

const AssessmentManagementWrapper = () => {
  return (
    <>
      <AssessmentManagementPage />
    </>
  )
}

export { AssessmentManagementWrapper }

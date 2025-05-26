import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import {
  CandidateTable,
} from '../components/tables/CandidateTable'
import React from 'react';

const CandidatePage = () => {

  return(
  <>
    <ToolbarWrapper title="Candidate Dashboard" subtitle="Recruitment" />
    <Content>
      <CandidateTable />
    </Content>
  </>
  )
  
}

const CandidatesWrapper = () => {
  return (
    <>
      <CandidatePage />
    </>
  )
}

export { CandidatesWrapper }

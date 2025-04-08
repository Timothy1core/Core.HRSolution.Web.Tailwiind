import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import {
  CandidateTable,
} from '../components/tables/CandidateTable'
import React from 'react';

const CandidatePage = () => {

  return(
  <>
    <Content>
      <CandidateTable className='mb-5 mb-xl-8' />
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

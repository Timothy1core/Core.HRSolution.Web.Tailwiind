
// import { PageTitle } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import {
  SectionMenuTable,
} from './components/tables/SectionMenuTable'
import React from 'react';

const SectionMenuManagementPage = () => {


  return(
  <>
    <ToolbarWrapper title="Section Menu Management" subtitle="System Setup" />
    <Content>
      <SectionMenuTable className='mb-5 mb-xl-8' />
    </Content>
  </>
  )
  
}

const SectionMenuManagementWrapper = () => {
  return (
    <>
      <SectionMenuManagementPage />
    </>
  )
}

export { SectionMenuManagementWrapper }
